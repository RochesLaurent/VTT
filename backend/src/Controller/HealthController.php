<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;

class HealthController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {}

    #[Route('/api/health', name: 'api_health_check', methods: ['GET'])]
    public function healthCheck(): JsonResponse
    {
        $checks = [
            'status' => 'OK',
            'service' => 'onlyroll-backend',
            'timestamp' => date('c'),
            'environment' => $this->getParameter('kernel.environment'),
            'checks' => []
        ];

        // Vérification base de données
        try {
            $this->entityManager->getConnection()->connect();
            $checks['checks']['database'] = 'OK';
        } catch (\Exception $e) {
            $checks['checks']['database'] = 'ERROR: ' . $e->getMessage();
            $checks['status'] = 'DEGRADED';
        }

        // Vérification JWT
        try {
            $jwtDir = $this->getParameter('kernel.project_dir') . '/config/jwt';
            if (file_exists($jwtDir . '/private.pem') && file_exists($jwtDir . '/public.pem')) {
                $checks['checks']['jwt'] = 'OK';
            } else {
                $checks['checks']['jwt'] = 'WARNING: JWT keys missing';
                $checks['status'] = 'DEGRADED';
            }
        } catch (\Exception $e) {
            $checks['checks']['jwt'] = 'ERROR: ' . $e->getMessage();
        }

        // Déterminer le code de statut HTTP
        $httpStatus = ($checks['status'] === 'OK') ? Response::HTTP_OK : Response::HTTP_SERVICE_UNAVAILABLE;

        return new JsonResponse($checks, $httpStatus);
    }

    #[Route('/api/ping', name: 'api_ping', methods: ['GET'])]
    public function ping(): JsonResponse
    {
        return new JsonResponse([
            'message' => 'pong',
            'service' => 'onlyroll-backend',
            'timestamp' => date('c')
        ]);
    }
}