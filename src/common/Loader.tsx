// src/components/Loader.tsx
const Loader = () => {
  return (
    <div className="flex justify-center items-center">
      <svg className="animate-spin h-6 w-6 text-lime-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
        <path
          fill="currentColor"
          d="M25 2C12.5 2 2 12.5 2 25s10.5 23 23 23 23-10.5 23-23S37.5 2 25 2zm0 44c-11.6 0-21-9.4-21-21S13.4 4 25 4s21 9.4 21 21-9.4 21-21 21z"
        />
        <path
          fill="currentColor"
          d="M25 7c-1.1 0-2 .9-2 2v12h-2c-1.1 0-2 .9-2 2s.9 2 2 2h6c1.1 0 2-.9 2-2s-.9-2-2-2h-2V9c0-1.1-.9-2-2-2z"
        />
      </svg>
    </div>
  );
};

export default Loader;
