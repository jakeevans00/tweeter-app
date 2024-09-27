type Props = {
  fn: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  setAlias: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
};

export default function AuthenticationFields({
  fn,
  setAlias,
  setPassword,
}: Props) {
  return (
    <>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          size={50}
          id="aliasInput"
          placeholder="name@example.com"
          onKeyDown={fn}
          onChange={(event) => setAlias(event.target.value)}
        />
        <label htmlFor="aliasInput">Alias</label>
      </div>
      <div className="form-floating mb-3">
        <input
          type="password"
          className="form-control bottom"
          id="passwordInput"
          placeholder="Password"
          onKeyDown={fn}
          onChange={(event) => setPassword(event.target.value)}
        />
        <label htmlFor="passwordInput">Password</label>
      </div>
    </>
  );
}
