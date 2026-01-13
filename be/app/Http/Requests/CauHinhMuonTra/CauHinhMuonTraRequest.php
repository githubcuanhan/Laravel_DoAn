<?php

namespace App\Http\Requests\CauHinhMuonTra;

use Illuminate\Foundation\Http\FormRequest;

class CauHinhMuonTraRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'soNgayToiDa' => 'required|integer|min:1|max:365',
            'mucPhatMoiNgay' => 'required|numeric|min:0',
            'apDungTuNgay' => 'required|date',
            'apDungDenNgay' => 'nullable|date|after_or_equal:apDungTuNgay',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'soNgayToiDa.required' => 'Số ngày tối đa là bắt buộc',
            'soNgayToiDa.integer' => 'Số ngày tối đa phải là số nguyên',
            'soNgayToiDa.min' => 'Số ngày tối đa phải ít nhất là 1',
            'soNgayToiDa.max' => 'Số ngày tối đa không được vượt quá 365',
            
            'mucPhatMoiNgay.required' => 'Mức phạt mỗi ngày là bắt buộc',
            'mucPhatMoiNgay.numeric' => 'Mức phạt mỗi ngày phải là số',
            'mucPhatMoiNgay.min' => 'Mức phạt mỗi ngày không được âm',
            
            'apDungTuNgay.required' => 'Ngày áp dụng là bắt buộc',
            'apDungTuNgay.date' => 'Ngày áp dụng không hợp lệ',
            
            'apDungDenNgay.date' => 'Ngày kết thúc không hợp lệ',
            'apDungDenNgay.after_or_equal' => 'Ngày kết thúc phải sau hoặc bằng ngày áp dụng',
        ];
    }
}

