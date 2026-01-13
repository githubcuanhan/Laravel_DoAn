<?php

namespace App\Http\Requests\PhieuMuon;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePhieuMuonRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'trangThai' => 'nullable|in:dang_muon,da_tra,qua_han,huy',
            'ghiChu' => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'trangThai.in' => 'Trạng thái không hợp lệ',
        ];
    }
}

