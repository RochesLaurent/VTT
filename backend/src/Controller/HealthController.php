<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class HealthController extends AbstractController
{
    #[Route('/api/health', name: 'health_check', methods: ['GET'])]
    public function healthCheck(): JsonResponse
    {
        return new JsonResponse([
            'status' => 'OK',
            'service' => 'onlyroll-backend',
            'timestamp' => date('c')
        ]);
    }
}