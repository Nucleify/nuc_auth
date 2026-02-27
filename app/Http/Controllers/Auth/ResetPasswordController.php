<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\ResetsPasswords;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ResetPasswordController extends Controller
{
    use ResetsPasswords;

    protected function sendResetResponse(Request $request, $response): JsonResponse
    {
        return new JsonResponse(['message' => trans($response)], 200);
    }
}
