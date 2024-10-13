import { useState } from "react";

const NewsletterSubscription = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement newsletter subscription logic
    console.log(`Subscribing ${email} to the newsletter`);
    setEmail("");
  };

  return (
    <div className="bg-indigo-700 dark:bg-indigo-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center">
        <div className="lg:w-0 lg:flex-1">
          <h2
            className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
            id="newsletter-headline"
          >
            Sign up for our newsletter
          </h2>
          <p className="mt-3 max-w-3xl text-lg leading-6 text-indigo-200">
            Get the latest remote job opportunities and career advice delivered
            to your inbox.
          </p>
        </div>
        <div className="mt-8 lg:mt-0 lg:ml-8">
          <form className="sm:flex" onSubmit={handleSubmit}>
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-address"
              name="email-address"
              type="email"
              autoComplete="email"
              required
              className="w-full px-5 py-3 border border-transparent placeholder-gray-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white focus:border-white sm:max-w-xs rounded-md"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
              <button
                type="submit"
                className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white"
              >
                Subscribe
              </button>
            </div>
          </form>
          <p className="mt-3 text-sm text-indigo-200">
            We care about your data. Read our{" "}
            <a href="#" className="text-white font-medium underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSubscription;
