<?php

namespace App\Http\Requests\Book;

use App\Helpers\ApiResponse;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Contracts\Validation\Validator;

class BookRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'maSach' => ['required', 'string', 'max:50'],
            'maQR'  => ['nullable', 'string', 'max:255'],
            'tenSach' => ['required', 'string', 'max:255'],
            'tacGia' => ['nullable', 'string', 'max:255'],
            'nhaXuatBan' => ['nullable', 'string', 'max:255'],
            'namXuatBan' => ['nullable', 'integer', 'min:1000', 'max:' . date('Y')],
            'soLuong' => ['required', 'integer', 'min:0'],
            'soLuongKhaDung' => ['required', 'integer', 'min:0'],
            'trangThai' => ['required', Rule::in(['dang_su_dung', 'tam_khoa', 'ngung_phuc_vu'])],
            'moTa' => ['nullable', 'string'],
            'idKeSach' => ['nullable', 'integer', 'exists:kesach,idKeSach'],
            'images' => ['nullable', 'array'],
            'images.*' => ['string', 'max:255'],
            'danhMucIds' => ['nullable', 'integer'],
            // THÊM DÒNG DƯỚI ĐÂY ĐỂ CHẤP NHẬN DỮ LIỆU SIZE SÁCH
            'sizesach' => ['nullable', 'string', Rule::in(['lon', 'vua', 'nho'])],
        ];
    }

    public function messages(): array
    {
        return [
            'maSach.required' => 'Mã sách không được để trống',
            'maSach.max' => 'Mã sách không được quá 50 ký tự',
            'maSach.unique' => 'Mã sách đã tồn tại',
            'tenSach.required' => 'Tên sách không được để trống',
            'tenSach.max' => 'Tên sách không được quá 255 ký tự',
            'soLuong.min' => 'Số lượng phải lớn hơn hoặc bằng 0',
            'soLuongKhaDung.min' => 'Số lượng khả dụng phải lớn hơn hoặc bằng 0',
            'trangThai.in' => 'Trạng thái không hợp lệ',
            'idKeSach.exists' => 'Kệ sách không tồn tại',
            // Thêm tin nhắn lỗi cho size nếu cần
            'sizesach.in' => 'Kích thước sách không hợp lệ (chỉ chấp nhận: lon, vua, nho)',
        ];
    }

    public function failedValidation(Validator $validator)
    {
        ApiResponse::validation($validator->errors());
    }
}