<?php

namespace App\Http\Requests\PhieuMuon;

use Illuminate\Foundation\Http\FormRequest;

class ReturnBookRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'ngayTraThucTe' => 'nullable|date',
            'trangThai' => 'nullable|in:da_tra,mat_sach',
        ];
    }

    public function messages(): array
    {
        return [
            'ngayTraThucTe.date' => 'Ngày trả không hợp lệ',
            'trangThai.in' => 'Trạng thái không hợp lệ',
        ];
    }
}

