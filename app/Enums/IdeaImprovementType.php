<?php

namespace App\Enums;

enum IdeaImprovementType: string
{
    case Process = 'process';
    case Product = 'product';
    case MemberExperience = 'member_experience';    
    
    public function label(): string
    {
        return match($this) {
            self::Process => 'Process',
            self::Product => 'Product',
            self::MemberExperience => 'Member Experience',
        };
    }    
}
