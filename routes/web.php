<?php

use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\DemoController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Auth::routes(['logout' => false]);

Route::match(['get', 'post'], '/logout', [LogoutController::class, 'logout'])
    ->middleware(['web', 'auth'])
    ->name('logout');

Route::post('/demo/session', [DemoController::class, 'store'])
    ->middleware(['web', 'throttle:1,1'])
    ->name('demo.session');
