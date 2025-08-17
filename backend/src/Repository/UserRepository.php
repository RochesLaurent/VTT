<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;

class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function upgradePassword(PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', $user::class));
        }

        $user->setPassword($newHashedPassword);
        $this->getEntityManager()->persist($user);
        $this->getEntityManager()->flush();
    }

    public function findByEmailOrUsername(string $identifier): ?User
    {
        return $this->createQueryBuilder('u')
            ->where('u.email = :identifier')
            ->orWhere('u.username = :identifier')
            ->setParameter('identifier', $identifier)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function isEmailAvailable(string $email, ?User $excludeUser = null): bool
    {
        $qb = $this->createQueryBuilder('u')
            ->select('COUNT(u.id)')
            ->where('u.email = :email')
            ->setParameter('email', $email);

        if ($excludeUser !== null) {
            $qb->andWhere('u.id != :userId')
               ->setParameter('userId', $excludeUser->getId());
        }

        return $qb->getQuery()->getSingleScalarResult() === 0;
    }

    public function isUsernameAvailable(string $username, ?User $excludeUser = null): bool
    {
        $qb = $this->createQueryBuilder('u')
            ->select('COUNT(u.id)')
            ->where('u.username = :username')
            ->setParameter('username', $username);

        if ($excludeUser !== null) {
            $qb->andWhere('u.id != :userId')
               ->setParameter('userId', $excludeUser->getId());
        }

        return $qb->getQuery()->getSingleScalarResult() === 0;
    }

    public function isPseudoAvailable(string $pseudo, ?User $excludeUser = null): bool
    {
        $qb = $this->createQueryBuilder('u')
            ->select('COUNT(u.id)')
            ->where('u.pseudo = :pseudo')
            ->setParameter('pseudo', $pseudo);

        if ($excludeUser !== null) {
            $qb->andWhere('u.id != :userId')
               ->setParameter('userId', $excludeUser->getId());
        }

        return $qb->getQuery()->getSingleScalarResult() === 0;
    }

    public function findActiveUsers(int $limit = 10): array
    {
        return $this->createQueryBuilder('u')
            ->where('u.isActive = :active')
            ->setParameter('active', true)
            ->orderBy('u.lastLoginAt', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    public function findByRole(string $role): array
    {
        return $this->createQueryBuilder('u')
            ->where('u.roles LIKE :role')
            ->setParameter('role', '%"' . $role . '"%')
            ->getQuery()
            ->getResult();
    }

    public function searchUsers(string $query, int $limit = 20): array
    {
        $search = '%' . $query . '%';
        
        return $this->createQueryBuilder('u')
            ->where('u.username LIKE :search')
            ->orWhere('u.pseudo LIKE :search')
            ->orWhere('u.email LIKE :search')
            ->orWhere('u.firstname LIKE :search')
            ->orWhere('u.lastname LIKE :search')
            ->setParameter('search', $search)
            ->orderBy('u.username', 'ASC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    public function findUsersCreatedBetween(\DateTimeInterface $startDate, \DateTimeInterface $endDate): array
    {
        return $this->createQueryBuilder('u')
            ->where('u.createdAt >= :startDate')
            ->andWhere('u.createdAt <= :endDate')
            ->setParameter('startDate', $startDate)
            ->setParameter('endDate', $endDate)
            ->orderBy('u.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function getUserStatistics(): array
    {
        $totalUsers = $this->createQueryBuilder('u')
            ->select('COUNT(u.id)')
            ->getQuery()
            ->getSingleScalarResult();

        $activeUsers = $this->createQueryBuilder('u')
            ->select('COUNT(u.id)')
            ->where('u.isActive = :active')
            ->setParameter('active', true)
            ->getQuery()
            ->getSingleScalarResult();

        $verifiedUsers = $this->createQueryBuilder('u')
            ->select('COUNT(u.id)')
            ->where('u.isVerified = :verified')
            ->setParameter('verified', true)
            ->getQuery()
            ->getSingleScalarResult();

        $recentUsers = $this->createQueryBuilder('u')
            ->select('COUNT(u.id)')
            ->where('u.createdAt >= :date')
            ->setParameter('date', new \DateTime('-30 days'))
            ->getQuery()
            ->getSingleScalarResult();

        return [
            'total' => $totalUsers,
            'active' => $activeUsers,
            'verified' => $verifiedUsers,
            'recent' => $recentUsers,
            'inactive' => $totalUsers - $activeUsers,
        ];
    }

    public function updateLastLogin(User $user): void
    {
        $user->setLastLoginAt(new \DateTimeImmutable());
        $this->getEntityManager()->persist($user);
        $this->getEntityManager()->flush();
    }

    public function findUsersWithAvatars(): array
    {
        return $this->createQueryBuilder('u')
            ->where('u.avatar IS NOT NULL')
            ->getQuery()
            ->getResult();
    }

    public function cleanupInactiveUsers(int $days = 365): int
    {
        $date = new \DateTime('-' . $days . ' days');
        
        $users = $this->createQueryBuilder('u')
            ->where('u.lastLoginAt < :date OR u.lastLoginAt IS NULL')
            ->andWhere('u.createdAt < :date')
            ->setParameter('date', $date)
            ->getQuery()
            ->getResult();

        $count = count($users);
        
        foreach ($users as $user) {
            $this->getEntityManager()->remove($user);
        }
        
        $this->getEntityManager()->flush();
        
        return $count;
    }

    public function save(User $user, bool $flush = true): void
    {
        $this->getEntityManager()->persist($user);
        
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(User $user, bool $flush = true): void
    {
        $this->getEntityManager()->remove($user);
        
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}