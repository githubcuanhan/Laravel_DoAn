<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use App\Helpers\ApiResponse;

class RefreshTokenTaiKhoanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'refresh_token' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'refresh_token.required' => 'Refresh token không được để trống',
            'refresh_token.string' => 'Refresh token phải là chuỗi ký tự',
        ];
    }

    public function failedValidation(Validator $validator)
    {
        ApiResponse::validation($validator->errors());
    }
}
