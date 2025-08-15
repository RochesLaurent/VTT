<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;

#[Route('/api/auth')]
class AuthController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher,
        private ValidatorInterface $validator,
        private JWTTokenManagerInterface $jwtManager
    ) {}

    #[Route('/register', name: 'api_auth_register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return new JsonResponse(['error' => 'Données JSON invalides'], Response::HTTP_BAD_REQUEST);
        }

        $user = new User();
        $user->setEmail($data['email'] ?? '');
        $user->setUsername($data['username'] ?? '');
        $user->setPseudo($data['pseudo'] ?? '');
        $user->setFirstname($data['firstname'] ?? '');
        $user->setLastname($data['lastname'] ?? '');

        if (isset($data['password'])) {
            $hashedPassword = $this->passwordHasher->hashPassword($user, $data['password']);
            $user->setPassword($hashedPassword);
        }

        $errors = $this->validator->validate($user);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return new JsonResponse(['errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        $token = $this->jwtManager->create($user);

        return new JsonResponse([
            'message' => 'Utilisateur créé avec succès',
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'username' => $user->getUsername(),
                'pseudo' => $user->getPseudo(),
                'firstname' => $user->getFirstname(),
                'lastname' => $user->getLastname(),
            ],
            'token' => $token
        ], Response::HTTP_CREATED);
    }

    #[Route('/login', name: 'api_auth_login', methods: ['POST'])]
    public function login(): JsonResponse
    {
        // Cette méthode ne sera jamais appelée car la gestion du login
        // est faite automatiquement par le firewall security.yaml
        // Elle existe pour la documentation de l'API
        return new JsonResponse(['message' => 'Login endpoint']);
    }

    #[Route('/me', name: 'api_auth_me', methods: ['GET'])]
    public function me(): JsonResponse
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
            'roles' => $user->getRoles(),
            'createdAt' => $user->getCreatedAt()?->format('c'),
        ]);
    }

    #[Route('/refresh', name: 'api_auth_refresh', methods: ['POST'])]
    public function refresh(): JsonResponse
    {
        // Pour l'instant, simple endpoint qui retourne un nouveau token
        /** @var User $user */
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        $token = $this->jwtManager->create($user);

        return new JsonResponse(['token' => $token]);
    }
}