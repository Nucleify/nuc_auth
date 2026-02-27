<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\ConfirmsPasswords;
use Illuminate\Http\JsonResponse;

class ConfirmPasswordController extends Controller
{
    use ConfirmsPasswords;

    public function __construct()
    {
        $this->middleware('auth');
    }

    protected function confirmed(): JsonResponse
    {
        return new JsonResponse(['message' => 'Password confirmed'], 200);
    }
}
