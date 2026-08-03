import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";


export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="p-6 md:p-10 markdown-body">
      <ReactMarkdown
        // remarkPlugins: Markdownの構文解析段階で動作
        // remarkGfm: テーブル、取り消し線、タスクリスト、自動リンクを使用可能
        remarkPlugins={[remarkGfm]}
        // rehypePlugins: HTMLの変換段階で動作
        // rehypeRaw: 生HTMLを解釈・レンダリング
        // rehypeSlug: 見出しにid属性を付与
        rehypePlugins={[rehypeRaw, rehypeSlug]}
        components={{
          // アロー関数によって、上書きしたtableコンポーネントを定義するやり方
          /*
          table: ({ children, node: _node, ...props }) => (
            <div className="my-8 overflow-x-auto rounded-xl border border-zinc-200 shadow-sm dark:border-zinc-800">
              <table {...props} className="my-0 min-w-full border-0 text-sm">
                {children}
              </table>
            </div>
          ),
          */
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
