<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreIdeaRequest;
use App\Models\Idea;
use Illuminate\Http\JsonResponse;
use App\Enums\IdeaImprovementType;

class IdeaController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Idea::latest()->get());
    }

    public function store(StoreIdeaRequest $request): JsonResponse
    {
        $idea = Idea::create($request->validated());        
        
        return response()->json($idea, 201);
    }

    public function show(Idea $idea): JsonResponse
    {
        return response()->json($idea);
    }

    public function getImprovementTypes(): JsonResponse
    {
        $types = collect(IdeaImprovementType::cases())->map(fn($case) => [
            'id'    => $case->value,  
            'label' => $case->label(),
        ]);
        return response()->json($types);
    }

    public function upvote(Idea $idea): JsonResponse
    {
        $idea->increment('upvote_count');        

        return response()->json($idea);
    }

    public function downvote(Idea $idea): JsonResponse
    {
        $idea->decrement('upvote_count');        

        return response()->json($idea);
    }    
}
