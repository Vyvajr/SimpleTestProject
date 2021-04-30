export interface TreeNode {
    [key: string]: any // type for unknown keys.
    children?: TreeNode[] // type for a known property.
}