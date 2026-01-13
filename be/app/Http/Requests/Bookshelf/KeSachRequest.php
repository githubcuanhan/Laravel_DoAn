<?php

namespace App\Http\Requests\BookShelf;

use Illuminate\Foundation\Http\FormRequest;

class KeSachRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'idKhu' => 'required|integer|exists:khu,idKhu',
            'tenKe' => 'required|string|max:255',
            'moTa'  => 'nullable|string|max:255',
        ];
    }
}
