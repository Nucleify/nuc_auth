<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Auth::routes(['logout' => false]);

Route::post('/logout', [LogoutController::class, 'logout'])
    ->middleware(['web', 'auth'])
    ->name('logout');
