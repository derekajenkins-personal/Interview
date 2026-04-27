<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\IdeaStatus;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ideas', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('status', ['under_review', 'planned', 'implemented', 'declined'])->default(IdeaStatus::UnderReview->value);
            $table->enum('improvement_type', ['process', 'product', 'member_experience']);
            $table->text('author')->nullable();
            $table->integer('upvote_count')->default(0);
            $table->timestamps();
        });

        Schema::create('idea_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ideas_id')->constrained();
            $table->text('body')->nullable();
            $table->text('author')->nullable();
            $table->timestamps();
        });        
    }

    public function down(): void
    {
        Schema::dropIfExists('ideas');
        Schema::dropIfExists('idea_comments');
    }
};
