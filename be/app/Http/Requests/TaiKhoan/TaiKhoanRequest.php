<?php

namespace App\Http\Requests\TaiKhoan;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TaiKhoanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('id'); // Lấy id từ route nếu là update
        
        $rules = [
            'hoTen' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('taikhoan', 'email')->ignore($id),
            ],
            'vaiTro' => ['required', Rule::in(['admin', 'thuthu', 'bandoc'])],
            'trangThai' => ['required', Rule::in(['hoat_dong', 'tam_khoa', 'ngung'])],
            'soDienThoai' => 'nullable|string|max:20',
            'ngaySinh' => 'nullable|date',
            'diaChi' => 'nullable|string|max:500',
            'idLop' => 'nullable|integer|exists:lop,idLop',
            'maSinhVien' => 'nullable|string|max:50',
        ];

        // Password chỉ required khi tạo mới, optional khi update
        if ($this->isMethod('POST')) {
            $rules['password'] = 'required|string|min:6|max:255';
        } else {
            $rules['password'] = 'nullable|string|min:6|max:255';
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'hoTen.required' => 'Họ tên là bắt buộc',
            'email.required' => 'Email là bắt buộc',
            'email.email' => 'Email không hợp lệ',
            'email.unique' => 'Email đã tồn tại',
            'password.required' => 'Mật khẩu là bắt buộc',
            'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự',
            'vaiTro.required' => 'Vai trò là bắt buộc',
            'vaiTro.in' => 'Vai trò không hợp lệ',
            'trangThai.required' => 'Trạng thái là bắt buộc',
            'trangThai.in' => 'Trạng thái không hợp lệ',
            'idLop.exists' => 'Lớp không tồn tại',
        ];
    }
}

