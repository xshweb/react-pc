// 整数
export const integer_num = /^(0|[1-9][0-9]*|-[1-9][0-9]*)$/;
// 正整数含0
export const positive_num_zero = /^([1-9]\d*|0)$/;
// 正整数不含0
export const positive_num = /^([1-9][0-9]*)$/;

// 0.22
export const decimals_num = /^0(\.[1-9]([0-9]){0,1})$/;
// 大于0整数
export const than_zero = /^[1-9]{1}[0-9]*$|^0{1}\.{1}[0-9]+$|^[1-9]{1}[0-9]*\.{1}[0-9]+$/;
// 手机号
export const regphone = /^1[23456789]\d{9}$/;
// 0-1
export const percentnum = /^(0)$|^(0(\.{1}\d+))$|^(1)$/;
// 大于等于0
export const includezero = /^(0)$|^[1-9]{1}[0-9]*$|^0{1}\.{1}[0-9]+$|^[1-9]{1}[0-9]*\.{1}[0-9]+$/;
// 大于0
export const excludezero = /^[1-9]{1}[0-9]*$|^0{1}\.{1}[0-9]+$|^[1-9]{1}[0-9]*\.{1}[0-9]+$/;

export const phone = /^1[23456789]\d{9}$/;

export const telphone = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;

// 经度 -180.0000~180.0000
export const longitude = /^-?((0|1?[0-7]?[0-9]?)(([.][0-9]{1,4})?)|180(([.][0]{1,4})?))$/;

// 维度 -90.0000~90.0000
export const latitude = /^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,4})?)|90(([.][0]{1,4})?))$/;

// 正负数
export const regnumber = /^(-|\+)?\d+(\.\d+)?$/;

// 0-100 (不包括0和100)
export const regercent = /^0$|^100$|^0.\d+$|^[1-9]([0-9])?(\.\d+)?$/;

// 正负数
export const regnumber2 = /(^[-0-9][0-9]*(\.(\d{1,2}))?)$/;
