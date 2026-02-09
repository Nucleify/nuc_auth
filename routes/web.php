<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Auth::routes(['logout' => false]);

Route::middleware('web')->group(function () {
    Route::get('login', fn () => redirect('/en/login'))->name('login');
    Route::get('register', fn () => redirect('/en/register'))->name('register');
    Route::get('{lang}/login', fn ($lang) => serveNuxtPage("{$lang}/login"))->where('lang', 'en|pl');
    Route::get('{lang}/register', fn ($lang) => serveNuxtPage("{$lang}/register"))->where('lang', 'en|pl');
});
