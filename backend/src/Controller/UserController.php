<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\UserService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;

#[Route('/api/users')]
#[IsGranted('ROLE_USER')]
class UserController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ValidatorInterface $validator,
        private UserPasswordHasherInterface $passwordHasher,
        private SerializerInterface $serializer,
        private UserService $userService
    ) {}

    #[Route('/profile', name: 'api_users_profile_get', methods: ['GET'])]
    public function getProfile(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        return new JsonResponse([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'username' => $user->getUsername(),
            'pseudo' => $user->getPseudo(),
            'firstname' => $user->getFirstname(),
            'lastname' => $user->getLastname(),
            'fullName' => $user->getFullName(),
            'roles' => $user->getRoles(),
            'avatar' => $user->getAvatar(),
            'bio' => $user->getBio(),
            'preferences' => $user->getPreferences(),
            'createdAt' => $user->getCreatedAt()?->format('c'),
            'updatedAt' => $user->getUpdatedAt()?->format('c'),
        ]);
    }

    #[Route('/profile', name: 'api_users_profile_update', methods: ['PUT', 'PATCH'])]
    public function updateProfile(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return new JsonResponse(['error' => 'Données JSON invalides'], Response::HTTP_BAD_REQUEST);
        }

        $updatableFields = ['pseudo', 'firstname', 'lastname', 'bio'];
        $emailChanged = false;
        $passwordChanged = false;

        foreach ($updatableFields as $field) {
            if (isset($data[$field])) {
                $setter = 'set' . ucfirst($field);
                if (method_exists($user, $setter)) {
                    $user->$setter($data[$field]);
                }
            }
        }

        if (isset($data['email']) && $data['email'] !== $user->getEmail()) {
            $existingUser = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
            if ($existingUser && $existingUser->getId() !== $user->getId()) {
                return new JsonResponse(['error' => 'Cet email est déjà utilisé'], Response::HTTP_CONFLICT);
            }
            $user->setEmail($data['email']);
            $emailChanged = true;
        }

        if (isset($data['currentPassword']) && isset($data['newPassword'])) {
            if (!$this->passwordHasher->isPasswordValid($user, $data['currentPassword'])) {
                return new JsonResponse(['error' => 'Mot de passe actuel incorrect'], Response::HTTP_BAD_REQUEST);
            }

            $hashedPassword = $this->passwordHasher->hashPassword($user, $data['newPassword']);
            $user->setPassword($hashedPassword);
            $passwordChanged = true;
        }

        if (isset($data['preferences']) && is_array($data['preferences'])) {
            $user->setPreferences($data['preferences']);
        }

        $user->setUpdatedAt(new \DateTimeImmutable());

        $errors = $this->validator->validate($user);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return new JsonResponse(['errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->flush();

        $response = [
            'message' => 'Profil mis à jour avec succès',
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'username' => $user->getUsername(),
                'pseudo' => $user->getPseudo(),
                'firstname' => $user->getFirstname(),
                'lastname' => $user->getLastname(),
                'fullName' => $user->getFullName(),
                'avatar' => $user->getAvatar(),
                'bio' => $user->getBio(),
                'preferences' => $user->getPreferences(),
                'updatedAt' => $user->getUpdatedAt()?->format('c'),
            ]
        ];

        if ($emailChanged) {
            $response['info'][] = 'Email modifié avec succès';
        }
        if ($passwordChanged) {
            $response['info'][] = 'Mot de passe modifié avec succès';
        }

        return new JsonResponse($response);
    }

    #[Route('/avatar', name: 'api_users_avatar_upload', methods: ['POST'])]
    public function uploadAvatar(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        $file = $request->files->get('avatar');

        if (!$file) {
            return new JsonResponse(['error' => 'Aucun fichier fourni'], Response::HTTP_BAD_REQUEST);
        }

        $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!in_array($file->getMimeType(), $allowedMimeTypes)) {
            return new JsonResponse(['error' => 'Type de fichier non autorisé. Utilisez JPG, PNG, GIF ou WebP'], Response::HTTP_BAD_REQUEST);
        }

        if ($file->getSize() > 5 * 1024 * 1024) {
            return new JsonResponse(['error' => 'Le fichier est trop volumineux (max 5MB)'], Response::HTTP_BAD_REQUEST);
        }

        try {
            $avatarUrl = $this->userService->uploadAvatar($user, $file);
            
            $user->setAvatar($avatarUrl);
            $user->setUpdatedAt(new \DateTimeImmutable());
            $this->entityManager->flush();

            return new JsonResponse([
                'message' => 'Avatar mis à jour avec succès',
                'avatar' => $avatarUrl,
                'user' => [
                    'id' => $user->getId(),
                    'avatar' => $avatarUrl,
                    'updatedAt' => $user->getUpdatedAt()?->format('c'),
                ]
            ]);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Erreur lors du téléchargement de l\'avatar'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/avatar', name: 'api_users_avatar_delete', methods: ['DELETE'])]
    public function deleteAvatar(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        if ($user->getAvatar()) {
            $this->userService->deleteAvatar($user);
            
            $user->setAvatar(null);
            $user->setUpdatedAt(new \DateTimeImmutable());
            $this->entityManager->flush();
        }

        return new JsonResponse([
            'message' => 'Avatar supprimé avec succès',
            'user' => [
                'id' => $user->getId(),
                'avatar' => null,
                'updatedAt' => $user->getUpdatedAt()?->format('c'),
            ]
        ]);
    }

    #[Route('/account', name: 'api_users_account_delete', methods: ['DELETE'])]
    public function deleteAccount(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);

        if (!isset($data['password'])) {
            return new JsonResponse(['error' => 'Mot de passe requis pour confirmer la suppression'], Response::HTTP_BAD_REQUEST);
        }

        if (!$this->passwordHasher->isPasswordValid($user, $data['password'])) {
            return new JsonResponse(['error' => 'Mot de passe incorrect'], Response::HTTP_UNAUTHORIZED);
        }

        if (!isset($data['confirmation']) || $data['confirmation'] !== 'DELETE') {
            return new JsonResponse(['error' => 'Veuillez confirmer la suppression en envoyant confirmation: "DELETE"'], Response::HTTP_BAD_REQUEST);
        }

        try {
            $this->userService->deleteUserAccount($user);

            return new JsonResponse([
                'message' => 'Compte supprimé avec succès',
                'info' => 'Toutes vos données ont été supprimées de nos serveurs'
            ]);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Erreur lors de la suppression du compte'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/check-email', name: 'api_users_check_email', methods: ['POST'])]
    public function checkEmailAvailability(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['email'])) {
            return new JsonResponse(['error' => 'Email requis'], Response::HTTP_BAD_REQUEST);
        }

        $email = $data['email'];
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return new JsonResponse(['available' => false, 'reason' => 'Format d\'email invalide'], Response::HTTP_BAD_REQUEST);
        }

        $existingUser = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $email]);
        
        /** @var User $currentUser */
        $currentUser = $this->getUser();
        
        if ($existingUser && $currentUser && $existingUser->getId() === $currentUser->getId()) {
            return new JsonResponse(['available' => true]);
        }

        return new JsonResponse([
            'available' => !$existingUser,
            'reason' => $existingUser ? 'Cet email est déjà utilisé' : null
        ]);
    }

    #[Route('/check-username', name: 'api_users_check_username', methods: ['POST'])]
    public function checkUsernameAvailability(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['username'])) {
            return new JsonResponse(['error' => 'Username requis'], Response::HTTP_BAD_REQUEST);
        }

        $username = $data['username'];
        $existingUser = $this->entityManager->getRepository(User::class)->findOneBy(['username' => $username]);
        
        /** @var User $currentUser */
        $currentUser = $this->getUser();
        
        if ($existingUser && $currentUser && $existingUser->getId() === $currentUser->getId()) {
            return new JsonResponse(['available' => true]);
        }

        return new JsonResponse([
            'available' => !$existingUser,
            'reason' => $existingUser ? 'Ce nom d\'utilisateur est déjà pris' : null
        ]);
    }

    #[Route('/check-pseudo', name: 'api_users_check_pseudo', methods: ['POST'])]
    public function checkPseudoAvailability(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['pseudo'])) {
            return new JsonResponse(['error' => 'Pseudo requis'], Response::HTTP_BAD_REQUEST);
        }

        $pseudo = $data['pseudo'];
        
        $currentUser = $this->getUser();
        
        $available = $this->userService->isPseudoAvailable($pseudo, $currentUser);

        return new JsonResponse([
            'available' => $available,
            'reason' => !$available ? 'Ce pseudo est déjà pris' : null
        ]);
    }

    #[Route('/preferences', name: 'api_users_preferences_update', methods: ['PUT'])]
    public function updatePreferences(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);

        if (!$data || !is_array($data)) {
            return new JsonResponse(['error' => 'Données JSON invalides'], Response::HTTP_BAD_REQUEST);
        }

        $currentPreferences = $user->getPreferences() ?? [];
        $updatedPreferences = array_merge($currentPreferences, $data);

        $user->setPreferences($updatedPreferences);
        $user->setUpdatedAt(new \DateTimeImmutable());

        $this->entityManager->flush();

        return new JsonResponse([
            'message' => 'Préférences mises à jour avec succès',
            'preferences' => $updatedPreferences
        ]);
    }
}