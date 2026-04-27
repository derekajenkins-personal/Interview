<?php
use App\Http\Controllers\Api\IdeaController;
use App\Http\Controllers\Api\TaskController;
use Illuminate\Support\Facades\Route;

Route::apiResource('tasks', TaskController::class);

Route::get('ideas/improvement-types', [IdeaController::class, 'getImprovementTypes']);
Route::patch('ideas/{idea}/upvote', [IdeaController::class, 'upvote']);
Route::patch('ideas/{idea}/downvote', [IdeaController::class, 'downvote']);
Route::apiResource('ideas', IdeaController::class);
