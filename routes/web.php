<?php

use App\Http\Controllers\Auth\LogoutController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Auth::routes(['logout' => false]);

Route::match(['get', 'post'], '/logout', [LogoutController::class, 'logout'])
    ->middleware(['web', 'auth'])
    ->name('logout');
