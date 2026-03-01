<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Contact;
use App\Models\Money;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DemoController extends Controller
{
    private const DEMO_TTL_MINUTES = 30;

    public function store(): JsonResponse
    {
        $demoUser = $this->createDemoUser();

        $this->seedDemoData($demoUser);

        Auth::login($demoUser);

        return response()->json([
            'message' => 'Demo session created',
            'user' => $demoUser->only(['id', 'name', 'email', 'role', 'created_at', 'updated_at']),
        ]);
    }

    private function createDemoUser(): User
    {
        $attributes = [
            'name' => 'Demo User',
            'email' => 'demo_' . Str::uuid() . '@nucleify.io',
            'password' => Hash::make(Str::random(32)),
            'role' => 'demo',
            'is_demo' => true,
            'demo_expires_at' => now()->addMinutes(self::DEMO_TTL_MINUTES),
        ];

        try {
            return User::create($attributes);
        } catch (QueryException $exception) {
            // Production-safe recovery when Postgres sequence falls behind table max(id).
            if (!$this->isUsersPrimaryKeyConflict($exception)) {
                throw $exception;
            }

            $this->syncUsersIdSequence();

            return User::create($attributes);
        }
    }

    private function isUsersPrimaryKeyConflict(QueryException $exception): bool
    {
        return ($exception->errorInfo[0] ?? null) === '23505'
            && str_contains((string) ($exception->errorInfo[2] ?? ''), 'users_pkey');
    }

    private function syncUsersIdSequence(): void
    {
        DB::statement(
            "SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE(MAX(id), 1), true) FROM users"
        );
    }

    private function seedDemoData(User $user): void
    {
        $categories = ['technology', 'business', 'design', 'marketing'];

        foreach (range(1, 5) as $i) {
            Article::create([
                'user_id' => $user->id,
                'title' => "Demo Article $i",
                'description' => 'This is a demo article showcasing the Nucleify dashboard.',
                'category' => $categories[array_rand($categories)],
            ]);
        }

        $contacts = [
            ['first_name' => 'Alice', 'last_name' => 'Johnson', 'email' => 'alice@demo.io'],
            ['first_name' => 'Bob', 'last_name' => 'Smith', 'email' => 'bob@demo.io'],
            ['first_name' => 'Carol', 'last_name' => 'Williams', 'email' => 'carol@demo.io'],
        ];

        foreach ($contacts as $contact) {
            Contact::create(array_merge($contact, [
                'user_id' => $user->id,
                'role' => 'user',
            ]));
        }

        $moneyEntries = [
            ['sender' => 'Client A', 'receiver' => 'Nucleify', 'count' => 2500, 'title' => 'Web Development', 'category' => 'income'],
            ['sender' => 'Nucleify', 'receiver' => 'Hosting Provider', 'count' => 120, 'title' => 'Server Costs', 'category' => 'expense'],
            ['sender' => 'Client B', 'receiver' => 'Nucleify', 'count' => 4800, 'title' => 'E-commerce Project', 'category' => 'income'],
        ];

        foreach ($moneyEntries as $entry) {
            Money::create(array_merge($entry, [
                'user_id' => $user->id,
                'description' => 'Demo transaction',
            ]));
        }
    }
}
