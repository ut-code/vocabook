import type { MDXComponents } from 'mdx/types'
import type { ReactNode } from 'react'

// The Rust-based MDX compiler (experimental.mdxRs) emits raw "\n" text
// nodes between table child elements. Browsers strip whitespace text
// nodes when parsing <table>, but React still expects them during
// hydration, causing a mismatch. Strip whitespace-only children here so
// server and client agree.
function stripWhitespace(children: ReactNode): ReactNode {
  return Array.isArray(children)
    ? children.filter((child) => typeof child !== 'string' || child.trim() !== '')
    : children
}

const components: MDXComponents = {
  table: ({ children, ...props }) => (
    <table {...props}>{stripWhitespace(children)}</table>
  ),
  thead: ({ children, ...props }) => (
    <thead {...props}>{stripWhitespace(children)}</thead>
  ),
  tbody: ({ children, ...props }) => (
    <tbody {...props}>{stripWhitespace(children)}</tbody>
  ),
  tr: ({ children, ...props }) => (
    <tr {...props}>{stripWhitespace(children)}</tr>
  ),
}

export function useMDXComponents(): MDXComponents {
  return components
}