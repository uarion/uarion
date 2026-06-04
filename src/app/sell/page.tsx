export default function SellPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">등록·검증 신청</h1>
        <p className="mt-2 text-slate-400">
          등록하면 검증 점수가 매겨지고 등록 시점이 기록됩니다. (현재는 UI만
          제공)
        </p>
      </div>

      <form className="space-y-6 rounded-xl border border-navy-700 bg-navy-900 p-8">
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            제목
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="등록물 제목을 입력하세요"
            className="w-full rounded-lg border border-navy-700 bg-navy-800 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            설명
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            placeholder="등록물에 대한 설명을 입력하세요"
            className="w-full resize-y rounded-lg border border-navy-700 bg-navy-800 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div>
          <label
            htmlFor="price"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            가격 (원)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min={0}
            placeholder="0"
            className="w-full rounded-lg border border-navy-700 bg-navy-800 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div>
          <label
            htmlFor="file"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            파일
          </label>
          <input
            id="file"
            name="file"
            type="file"
            className="w-full text-sm text-slate-400 file:mr-4 file:rounded-lg file:border-0 file:bg-navy-700 file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-200 hover:file:bg-navy-600"
          />
        </div>

        <fieldset>
          <legend className="mb-3 block text-sm font-medium text-slate-300">
            창작물 유형
          </legend>
          <div className="space-y-2">
            {[
              { id: "type-original", value: "original", label: "본인 창작물" },
              { id: "type-ai", value: "ai", label: "AI 합성물" },
              { id: "type-other", value: "other", label: "기타" },
            ].map((option) => (
              <label
                key={option.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-sm text-slate-300 has-[:checked]:border-accent/40 has-[:checked]:bg-navy-800"
              >
                <input
                  type="radio"
                  name="creationType"
                  id={option.id}
                  value={option.value}
                  className="accent-accent"
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>

        <button
          type="button"
          className="w-full cursor-not-allowed rounded-lg bg-navy-700 px-6 py-3 text-base font-semibold text-slate-400"
        >
          검증 신청 (준비 중)
        </button>
      </form>
    </div>
  );
}
