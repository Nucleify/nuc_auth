<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Symfony\Component\HttpFoundation\Response;

class Authenticate extends Middleware
{
    protected function unauthenticated($request, array $guards): void
    {
        abort(Response::HTTP_UNAUTHORIZED, 'Unauthenticated.');
    }
}
