export const NoFlags = 0b00000000000000000000000000; // 标识位：无
export const Placement = 0b00000000000000000000000010; // 标识位：插入
export const Update = 0b00000000000000000000000100; // 标识位：更新
export const MutationMask = Placement | Update; // 变更标识位掩码