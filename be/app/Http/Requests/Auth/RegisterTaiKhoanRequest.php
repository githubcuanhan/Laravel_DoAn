<?php

namespace App\Http\Requests\Auth;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use App\Helpers\ApiResponse;
class RegisterTaiKhoanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'hoTen' => 'required|string|max:100',
            'email' => 'required|email|max:100|unique:taikhoan',
            'password' => 'required|string|min:6',
            'idLop' => 'nullable|exists:lop,idLop',
            'maSinhVien' => 'nullable|string|max:50|unique:taikhoan',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        ApiResponse::validation($validator->errors());
    }
}
