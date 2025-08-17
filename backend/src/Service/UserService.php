<?php

namespace App\Service;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\Filesystem\Filesystem;
use Psr\Log\LoggerInterface;

class UserService
{
    private string $uploadsDirectory;
    private string $publicPath;
    private Filesystem $filesystem;

    public function __construct(
        private EntityManagerInterface $entityManager,
        private SluggerInterface $slugger,
        private LoggerInterface $logger,
        string $projectDir
    ) {
        $this->uploadsDirectory = $projectDir . '/public/uploads/avatars';
        $this->publicPath = '/uploads/avatars';
        $this->filesystem = new Filesystem();
        
        if (!$this->filesystem->exists($this->uploadsDirectory)) {
            $this->filesystem->mkdir($this->uploadsDirectory);
        }
    }

    public function uploadAvatar(User $user, UploadedFile $file): string
    {
        if ($user->getAvatar()) {
            $this->deleteAvatar($user);
        }

        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $this->slugger->slug($originalFilename);
        $newFilename = $safeFilename . '-' . uniqid() . '.' . $file->guessExtension();

        try {
            $file->move($this->uploadsDirectory, $newFilename);
            
            return $this->publicPath . '/' . $newFilename;
        } catch (\Exception $e) {
            $this->logger->error('Erreur lors de l\'upload de l\'avatar', [
                'user_id' => $user->getId(),
                'error' => $e->getMessage()
            ]);
            throw new \Exception('Impossible de télécharger l\'avatar');
        }
    }

    public function deleteAvatar(User $user): void
    {
        if (!$user->getAvatar()) {
            return;
        }

        $filename = basename($user->getAvatar());
        $filepath = $this->uploadsDirectory . '/' . $filename;

        if ($this->filesystem->exists($filepath)) {
            try {
                $this->filesystem->remove($filepath);
            } catch (\Exception $e) {
                $this->logger->warning('Impossible de supprimer l\'avatar', [
                    'user_id' => $user->getId(),
                    'filepath' => $filepath,
                    'error' => $e->getMessage()
                ]);
            }
        }
    }

    public function deleteUserAccount(User $user): void
    {
        try {
            if ($user->getAvatar()) {
                $this->deleteAvatar($user);
            }
            
            $this->entityManager->remove($user);
            $this->entityManager->flush();
            
            $this->logger->info('Compte utilisateur supprimé', [
                'user_id' => $user->getId(),
                'email' => $user->getEmail()
            ]);
        } catch (\Exception $e) {
            $this->logger->error('Erreur lors de la suppression du compte', [
                'user_id' => $user->getId(),
                'error' => $e->getMessage()
            ]);
            throw new \Exception('Impossible de supprimer le compte');
        }
    }

    public function updateProfile(User $user, array $data): User
    {
        $allowedFields = ['pseudo', 'firstname', 'lastname', 'bio', 'preferences'];
        
        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $setter = 'set' . ucfirst($field);
                if (method_exists($user, $setter)) {
                    $user->$setter($data[$field]);
                }
            }
        }
        
        $user->setUpdatedAt(new \DateTimeImmutable());
        
        $this->entityManager->flush();
        
        return $user;
    }

    public function isEmailAvailable(string $email, ?User $excludeUser = null): bool
    {
        $userRepository = $this->entityManager->getRepository(User::class);
        return $userRepository->isEmailAvailable($email, $excludeUser);
    }

    public function isUsernameAvailable(string $username, ?User $excludeUser = null): bool
    {
        $userRepository = $this->entityManager->getRepository(User::class);
        return $userRepository->isUsernameAvailable($username, $excludeUser);
    }
    
    public function isPseudoAvailable(string $pseudo, ?User $excludeUser = null): bool
    {
        $userRepository = $this->entityManager->getRepository(User::class);
        return $userRepository->isPseudoAvailable($pseudo, $excludeUser);
    }

    public function getUserStatistics(User $user): array
    {
        return [
            'accountAge' => $this->calculateAccountAge($user),
            'lastActivity' => $user->getUpdatedAt()?->format('c'),
            'gamesCreated' => 0,
            'gamesJoined' => 0,
            'charactersCreated' => 0,
        ];
    }

    private function calculateAccountAge(User $user): int
    {
        if (!$user->getCreatedAt()) {
            return 0;
        }
        
        $now = new \DateTimeImmutable();
        $diff = $now->diff($user->getCreatedAt());
        
        return $diff->days;
    }
}