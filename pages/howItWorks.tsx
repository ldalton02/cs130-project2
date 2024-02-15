export default function HowItWorks() {

    const styles = `
    /* Style for the main list items */
    ul li {
        font-weight: bold;
        padding-bottom: 15px;
    }

    /* Style for the subtext within each list item */
    ul li span {
        font-weight: normal;
    }
    `;

    const htmlContent = (
    <div className="">
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10">
        <div className="container flex flex-col items-center gap-8 text-center">
          <h1 className="max-w-3xl font-heading font-semibold text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter">
            Join the conversation.
          </h1>
          <p className="max-w-5xl leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            At Bruin Banter, we believe in fostering meaningful connections while 
            respecting the need for privacy and anonymity. Our platform offers a unique 
            way for students at UCLA to engage in real-time conversations through anonymous chat rooms.
          </p>
        </div>
        <br></br>
        <br></br>
        <div className="max-w-5xl leading-normal text-muted-foreground sm:text-xl sm:leading-8 container flex flex-col items-center">
            <ul>
                <li>Join Anywhere, Participate Locally<br></br>
                    <span className = "text-muted-foreground">Users can access and read chat rooms from anywhere, whether 
                        they're in the library, cafeteria, or even off-campus. Simply log 
                        in to the app or website to start exploring conversations happening around you.
                    </span>
                </li>
                <li>Proximity-Based Posting<br></br>
                    <span className = "text-muted-foreground">
                    To ensure authenticity and enhance the sense of community, users
                     can only post messages within a certain range of the chat room's location. 
                     This feature encourages genuine interactions and discourages spam or irrelevant content.
                    </span>
                </li>
                <li>Privacy First<br></br>
                    <span className = "text-muted-foreground">
                    We prioritize user privacy and anonymity. You can chat freely
                     without the pressure of revealing your identity. Enjoy open discussions, 
                     share thoughts, seek advice, or simply connect with peers without the fear of judgment.
                    </span>
                </li>
                <li>Moderated for a Safe Environment<br></br>
                    <span className = "text-muted-foreground">
                    Our platform employs moderators to ensure a safe and respectful 
                    environment for all users. We have zero tolerance for harassment,
                     hate speech, or any form of harmful behavior.
                    </span>
                </li>
            </ul>
        </div>
      </section>
    </div>
  );

    return (
    <div className="how-it-works">
        <style>{styles}</style>
        {htmlContent}
    </div>
    );
}
