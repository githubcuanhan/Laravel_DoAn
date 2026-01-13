<?php

namespace App\Http\Requests\PhieuMuon;

use Illuminate\Foundation\Http\FormRequest;

class CreatePhieuMuonRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'ngayMuon' => 'nullable|date',
            'hanTra' => 'nullable|date|after:ngayMuon',
            'ghiChu' => 'nullable|string|max:255',
            'saches' => 'required|array|min:1',
            'saches.*.idSach' => 'required|integer|exists:sach,idSach',
            'saches.*.soLuong' => 'nullable|integer|min:1|max:5',
        ];
    }

    public function messages(): array
    {
        return [
            'idNguoiMuon.required' => 'Vui lòng chọn người mượn',
            'idNguoiMuon.exists' => 'Người mượn không tồn tại',
            'ngayMuon.date' => 'Ngày mượn không hợp lệ',
            'hanTra.date' => 'Hạn trả không hợp lệ',
            'hanTra.after' => 'Hạn trả phải sau ngày mượn',
            'saches.required' => 'Vui lòng chọn ít nhất 1 sách',
            'saches.*.idSach.required' => 'Vui lòng chọn sách',
            'saches.*.idSach.exists' => 'Sách không tồn tại',
            'saches.*.soLuong.min' => 'Số lượng phải ít nhất là 1',
            'saches.*.soLuong.max' => 'Số lượng tối đa là 5',
        ];
    }
}

