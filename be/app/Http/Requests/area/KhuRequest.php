<?php

namespace App\Http\Requests\Area;

use Illuminate\Foundation\Http\FormRequest;

class KhuRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tenKhu' => 'required|string|max:100',
            'viTri' => 'nullable|string|max:255',
            'moTa'  => 'nullable|string|max:255',
        ];
    }
}
