'use client';

export default function Dropdown(props: { id: string; label: string; items: string[], action: (value: string) => void }) {
  const { id, label, items, action } = props;

  return (
    <>
      <div className="relative text-left mb-6 w-full dropdown-container" data-dropdown-id={id}>
        <button
          type="button"
          className="kon dropdown-trigger rounded-lg flex items-center justify-between px-6 py-2 w-full text-white bg-red-900 -translate-y-[10px] [box-shadow:0_10px_0_#d1c9b4] active:[box-shadow:0_5px_0_#d1c2b5] active:-translate-y-[5px]"
          aria-expanded="false"
          aria-haspopup="true"
        >
          <span className="dropdown-label">{label}</span>
          <svg
            className="w-4 h-4 ml-2"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L5 5L9 1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </button>

        <div className="hidden absolute z-10 mt-2 w-full bg-white rounded-lg shadow divide-y divide-gray-100 dropdown-menu">
          <ul className="py-2 text-sm text-gray-700">
            {items.map((item, index) => (
              <li key={index}>
                <button
                  type="button"
                  className="dropdown-item block w-full text-left px-4 py-2 hover:bg-gray-100"
                  data-value={item}
                  onClick={() => {action(item)}}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <input type="hidden" name={id} value="" />
      </div>
    </>
  );
}

// For the script I put it in reportForm.astro :)