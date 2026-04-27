<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\IdeaStatus;
use App\Enums\IdeaImprovementType;

class Idea extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'status',
        'improvement_type',
        'author',
        'upvote_count',
    ];

    protected $attributes = [
        'status' => IdeaStatus::UnderReview,
        'upvote_count' => 0,
    ];

    protected $casts = [
        'status' => IdeaStatus::class,
        'improvement_type' => IdeaImprovementType::class,
    ];
}
