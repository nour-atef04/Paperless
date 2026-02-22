import FormInput from "../../_components/ui/FormInput";
import PanelTitle from "../../_components/ui/PanelTitle";

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <form className="bg-background flex h-full w-full flex-col justify-center gap-4 rounded-lg p-10 shadow-2xl sm:h-auto sm:w-[70%] md:w-[50%]">
        <PanelTitle level={1} id="Log in" className="mb-4">
          Log in
        </PanelTitle>
        <FormInput
          id="email"
          label="Insert email"
          type="email"
          placeholder="Email"
          className="p-2 pl-5"
        />
        <FormInput
          id="password"
          label="Insert password"
          type="password"
          placeholder="Password"
          className="p-2 pl-5"
        />

        <div className="text-brand mx-1 flex items-center justify-between text-sm">
          <div className="flex gap-1">
            <input type="checkbox" id="keep-logged" />
            <label htmlFor="keep-logged">Keep me logged in</label>
          </div>

          <button
            type="button"
            className="hover:text-brand-light cursor-pointer underline"
          >
            Forgot password?
          </button>
        </div>
        <button
          aria-label="Log in"
          className="bg-brand hover:bg-brand-light active:bg-brand-light mt-5 cursor-pointer rounded-3xl p-3 text-white transition-all hover:scale-[0.98] active:scale-[0.96]"
        >
          Log in
        </button>
      </form>
    </div>
  );
}
