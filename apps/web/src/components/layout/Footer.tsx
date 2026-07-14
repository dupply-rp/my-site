function InstagramIcon() {
  return (
    <svg
      className="social-icon"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.25 2A2.25 2.25 0 0 0 2 4.25v15.5A2.25 2.25 0 0 0 4.25 22h15.5A2.25 2.25 0 0 0 22 19.75V4.25A2.25 2.25 0 0 0 19.75 2H4.25Zm7.75 5.25a4.75 4.75 0 1 0 0 9.5 4.75 4.75 0 0 0 0-9.5ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.25-2.25a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z"
      />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg
      className="social-icon"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div className="socials">
          <a
            href="https://www.instagram.com/dupplybr"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon />
            @dupplybr
          </a>
          <a
            href="https://linkedin.com/company/dupplybr"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedInIcon />
            dupply
          </a>
        </div>
      </div>
    </footer>
  )
}
