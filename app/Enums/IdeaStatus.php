<?php

namespace App\Enums;

enum IdeaStatus: string
{
    case UnderReview = 'under_review';
    case Planned = 'planned';
    case Implemented = 'implemented';
    case Declined = 'declined';
}
