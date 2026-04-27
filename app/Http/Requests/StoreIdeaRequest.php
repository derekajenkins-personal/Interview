<?php

namespace App\Http\Requests;

use App\Enums\IdeaImprovementType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreIdeaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],            
            'improvement_type' => ['required', Rule::enum(IdeaImprovementType::class)],            
        ];
    }
}
