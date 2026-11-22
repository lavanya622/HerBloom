import { useState, useEffect } from "react";
import {
  Flower2, House, MessageCircle, BookHeart, Sparkles, Gamepad2,
  Leaf, Settings, Search, Bell, Heart, Sun, ArrowUpRight, Plus,
  Send, Trash2, Check, Circle, Wind, Star, LockKeyhole,
  CalendarDays, Sprout
} from "lucide-react";
import "./App.css";

const menu = [
  { label: "Home", icon: House },
  { label: "I'm Your Buddy", icon: MessageCircle },
  { label: "My Secret Diary", icon: BookHeart },
  { label: "My Inner World", icon: Sparkles },
  { label: "Bloom & Grow", icon: Leaf },
  { label: "Happy Corner", icon: Gamepad2 },
  { label: "Mood & Self-Care", icon: Heart },
];

const moods = [
  ["😊", "Happy"],
  ["🥰", "Loved"],
  ["😌", "Calm"],
  ["🥺", "Low"],
  ["😣", "Stressed"],
  ["🤔", "Unsure"],
];

function readStored(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

function App() {
  const [active, setActive] = useState("Home");
  const [fairyPointer, setFairyPointer] = useState({ x: -100, y: -100, visible: false, sparkle: 0 });
  const [profileName, setProfileName] = useState(() => localStorage.getItem("herbloom_profile_name") || "Bloom Friend");

  const [mood, setMood] = useState(
    () => localStorage.getItem("herbloom_mood") || ""
  );

  const [messages, setMessages] = useState([
    {
      from: "friend",
      text: "Hi, lovely! ♡ I'm here with you. What's on your mind today?"
    }
  ]);

  const [chatText, setChatText] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const [entries, setEntries] = useState(
    () => readStored("herbloom_entries", [])
  );

  const [diaryTitle, setDiaryTitle] = useState("");
  const [diaryText, setDiaryText] = useState("");
  const [showDiaryForm, setShowDiaryForm] = useState(false);

  const [answers, setAnswers] = useState(() =>
    readStored("herbloom_answers", {
      happy: "",
      proud: "",
      dream: "",
      value: ""
    })
  );
  const [savedReflections, setSavedReflections] = useState(() =>
    readStored("herbloom_reflections", [])
  );
  const [activeStory, setActiveStory] = useState(null);
  const [storyChapter, setStoryChapter] = useState(0);
  const [storyChoices, setStoryChoices] = useState([]);

  const [goals, setGoals] = useState(() =>
    readStored("herbloom_goals", [
      { id: 1, title: "Drink enough water", done: false },
      { id: 2, title: "Read for 10 minutes", done: false },
      { id: 3, title: "Take a little walk", done: false },
    ])
  );

  const [newGoal, setNewGoal] = useState("");

  const [gameScore, setGameScore] = useState(0);

  const [gameItems, setGameItems] = useState([
    "🌸", "🦋", "🌙", "🌷", "🌙", "🌸", "🌷", "🦋"
  ]);

  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [breathing, setBreathing] = useState(false);

  const [gratitude, setGratitude] = useState(
    () => localStorage.getItem("herbloom_gratitude") || ""
  );
  const [selfCareNotes, setSelfCareNotes] = useState(() =>
    readStored("herbloom_selfcare_notes", [])
  );

  // Follow the mouse with the existing fairy cursor and a tiny magical sparkle trail.
  useEffect(() => {
    const moveFairy = (event) => setFairyPointer({
      x: event.clientX, y: event.clientY, visible: true, sparkle: Date.now()
    });
    const hideFairy = () => setFairyPointer((old) => ({ ...old, visible: false }));
    window.addEventListener("pointermove", moveFairy);
    document.addEventListener("pointerleave", hideFairy);
    return () => {
      window.removeEventListener("pointermove", moveFairy);
      document.removeEventListener("pointerleave", hideFairy);
    };
  }, []);

  // Keep the chosen profile name on this device.
  useEffect(() => {
    localStorage.setItem("herbloom_profile_name", profileName);
  }, [profileName]);

  // Save personal data in this browser.
  useEffect(() => {
    localStorage.setItem("herbloom_entries", JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem("herbloom_answers", JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    localStorage.setItem("herbloom_reflections", JSON.stringify(savedReflections));
  }, [savedReflections]);

  useEffect(() => {
    localStorage.setItem("herbloom_goals", JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem("herbloom_gratitude", gratitude);
  }, [gratitude]);

  useEffect(() => {
    localStorage.setItem("herbloom_selfcare_notes", JSON.stringify(selfCareNotes));
  }, [selfCareNotes]);

  useEffect(() => {
    localStorage.setItem("herbloom_mood", mood);
  }, [mood]);

  const navigate = (page) => setActive(page);

  // Connect HerBloom chat to the Gemini backend.
  const sendMessage = async () => {
    const text = chatText.trim();

    if (!text || chatLoading) return;

    setMessages((old) => [
      ...old,
      { from: "you", text }
    ]);

    setChatText("");
    setChatLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: text,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "AI request failed");
      }

      setMessages((old) => [
        ...old,
        {
          from: "friend",
          text: data.reply || "I'm here with you. ♡"
        }
      ]);
    } catch (error) {
      console.error("HerBloom chat error:", error);

      setMessages((old) => [
        ...old,
        {
          from: "friend",
          text: "I'm having trouble connecting right now. Please check that the HerBloom AI server is running and try again. ♡"
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const saveEntry = () => {
    if (!diaryTitle.trim() && !diaryText.trim()) return;

    setEntries((old) => [
      {
        id: Date.now(),
        title: diaryTitle.trim() || "A little thought",
        text: diaryText,
        date: new Date().toLocaleDateString()
      },
      ...old
    ]);

    setDiaryTitle("");
    setDiaryText("");
    setShowDiaryForm(false);
  };

  const saveSelfCareNote = () => {
    if (!gratitude.trim()) return;
    setSelfCareNotes((old) => [{ id: Date.now(), text: gratitude.trim(), date: new Date().toLocaleString() }, ...old]);
    setGratitude("");
  };

  const saveInnerReflection = () => {
    const hasAnswers = Object.values(answers).some((value) => value.trim());
    if (!hasAnswers) return;
    setSavedReflections((old) => [{ id: Date.now(), answers: { ...answers }, date: new Date().toLocaleString() }, ...old]);
  };

  const addGoal = () => {
    if (!newGoal.trim()) return;

    setGoals((old) => [
      ...old,
      {
        id: Date.now(),
        title: newGoal.trim(),
        done: false
      }
    ]);

    setNewGoal("");
  };

  const toggleGoal = (id) => {
    setGoals((old) =>
      old.map((goal) =>
        goal.id === id
          ? { ...goal, done: !goal.done }
          : goal
      )
    );
  };

  const flipCard = (index) => {
    if (
      flipped.includes(index) ||
      matched.includes(index) ||
      flipped.length === 2
    ) return;

    const next = [...flipped, index];
    setFlipped(next);

    if (next.length === 2) {
      if (gameItems[next[0]] === gameItems[next[1]]) {
        setMatched((old) => [...old, ...next]);
        setGameScore((score) => score + 1);
        setFlipped([]);
      } else {
        window.setTimeout(() => setFlipped([]), 850);
      }
    }
  };

  const restartGame = () => {
    setGameItems(
      ["🌸", "🦋", "🌙", "🌷", "🌙", "🌸", "🌷", "🦋"]
        .sort(() => Math.random() - 0.5)
    );

    setFlipped([]);
    setMatched([]);
    setGameScore(0);
  };

  const pageIntro = {
    "I'm Your Buddy": [
      "YOUR BUDDY IS HERE",
      "Your space to talk",
      "You can share what's on your mind. You deserve kindness, always."
    ],
    "My Secret Diary": [
      "JUST BETWEEN YOU & YOU",
      "Your little diary",
      "A quiet place for your thoughts, memories and little moments."
    ],
    "My Inner World": [
      "GET TO KNOW YOURSELF",
      "Discover your inner world",
      "Your story is yours to write. Explore what makes you, you."
    ],
    "Bloom & Grow": [
      "GENTLE PROGRESS",
      "Little steps, big dreams",
      "You don't need to rush. Every small step counts."
    ],
    "Happy Corner": [
      "A LITTLE PLAYTIME",
      "A moment of joy",
      "Take a soft little break and let yourself play."
    ],
    "Mood & Self-Care": [
      "CARE FOR YOURSELF",
      "How are you, really?",
      "Pause for a moment. You deserve care on ordinary days too."
    ],
  };

  const PageHeader = ({ eyebrow, title, description }) => (
    <div className="page-title">
      <span className="eyebrow">
        <Sparkles size={13} /> {eyebrow}
      </span>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );

  const HomePage = () => (
    <>
      <section className="welcome-row">
        <div>
          <div className="eyebrow">
            <Sparkles size={14} /> A SPACE THAT'S JUST YOURS
          </div>

          <h1>Hello, beautiful <span>♡</span></h1>

          <p>
            Take a breath. You're here, and that's a lovely place to start.
          </p>
        </div>

        <div className="date-pill">
          <Sun size={17} /> A new day to bloom
        </div>
      </section>

      <section className="hero-card">
        <div className="hero-content">
          <span className="hero-tag">
            <Heart size={14} /> YOUR JOURNEY MATTERS
          </span>

          <h2>
            Make space for<br />the girl you're <em>becoming.</em>
          </h2>

          <p>
            Talk it out, write it down, discover yourself.<br />
            This little corner of the world is all yours.
          </p>

          <button
            className="primary-button"
            onClick={() => navigate("I'm Your Buddy")}
          >
            Talk to your buddy <ArrowUpRight size={17} />
          </button>
        </div>

        <div className="hero-art">
          <div className="art-circle">
            <img
              src="/animations/bloom-flower.gif"
              alt="A flower gently blooming"
              className="bloom-gif"
            />
          </div>

          <span className="floating-heart">♡</span>
          <span className="floating-star">✦</span>
          <span className="art-caption">Bloom at your own pace</span>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">A MOMENT WITH YOURSELF</span>
            <h2>How is your heart today?</h2>
          </div>

          <span className="soft-label">No feelings are wrong ♡</span>
        </div>

        <div className="mood-grid">
          {moods.map(([emoji, label]) => (
            <button
              key={label}
              className={`mood-card ${mood === label ? "selected" : ""}`}
              onClick={() => setMood(label)}
            >
              <span>{emoji}</span>
              <strong>{label}</strong>
            </button>
          ))}
        </div>

        {mood && (
          <p className="mood-feedback">
            You're feeling {mood.toLowerCase()} today.
            Thank you for checking in with yourself. ♡
          </p>
        )}
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">YOUR LITTLE CORNER</span>
            <h2>Where would you like to go?</h2>
          </div>

          <span className="soft-label">Explore your space</span>
        </div>

        <div className="feature-grid">
          {[
            [
              "I'm Your Buddy",
              MessageCircle,
              "YOUR BUDDY IS HERE",
              "Let's talk",
              "Share whatever is on your mind.",
              "feature-chat"
            ],
            [
              "My Secret Diary",
              BookHeart,
              "JUST BETWEEN YOU & YOU",
              "Your secret diary",
              "A place for thoughts and memories.",
              "feature-diary"
            ],
            [
              "Bloom & Grow",
              Leaf,
              "ONE DAY AT A TIME",
              "Grow gently",
              "Small steps, lovely habits and dreams.",
              "feature-grow"
            ],
            [
              "Happy Corner",
              Gamepad2,
              "A LITTLE PLAYTIME",
              "Happy corner",
              "A little break just for you.",
              "feature-games"
            ],
          ].map(([page, Icon, kicker, title, desc, style]) => (
            <button
              className={`feature-card ${style}`}
              key={page}
              onClick={() => navigate(page)}
            >
              <div className="feature-icon">
                <Icon />
              </div>

              <span className="feature-kicker">{kicker}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
              <ArrowUpRight className="feature-arrow" />
            </button>
          ))}
        </div>
      </section>

      <section className="bottom-note">
        <div className="note-flower">
          <Flower2 size={27} />
        </div>

        <div>
          <strong>A gentle reminder</strong>
          <p>
            You don't have to have it all figured out today.
            You're allowed to grow slowly.
          </p>
        </div>

        <Heart size={21} className="note-heart" />
      </section>
    </>
  );

  const ChatPage = () => (
    <>
      <PageHeader
        eyebrow={pageIntro[active][0]}
        title={pageIntro[active][1]}
        description={pageIntro[active][2]}
      />

      <div className="chat-card">
        <div className="chat-top">
          <div className="friend-avatar">
            <Flower2 />
          </div>

          <div>
            <strong>I'm your buddy</strong>
            <span>
              <i className="online-dot" /> Here to listen
            </span>
          </div>

          <span className="chat-safe">
            <LockKeyhole size={13} /> Your space
          </span>
        </div>

        <div className="chat-messages">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`message ${message.from}`}
            >
              <p>{message.text}</p>
            </div>
          ))}

          {chatLoading && (
            <div className="message friend">
              <p>Your buddy is thinking... ♡</p>
            </div>
          )}
        </div>

        <div className="chat-prompt">
          I'm your buddy. Talk to me like a close friend — I'm listening. ♡
        </div>

        <div className="chat-compose">
          <input
            value={chatText}
            onChange={(e) => setChatText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            placeholder="Write what's on your mind..."
          />

          <button
            className="send-button"
            onClick={sendMessage}
            disabled={chatLoading || !chatText.trim()}
            aria-label="Send message"
          >
            <Send size={17} />
          </button>
        </div>

        <p className="privacy-hint">
          HerBloom AI is here to support you. Avoid sharing sensitive personal information.
        </p>
      </div>
    </>
  );

  const DiaryPage = () => (
    <>
      <PageHeader
        eyebrow={pageIntro[active][0]}
        title={pageIntro[active][1]}
        description={pageIntro[active][2]}
      />

      <div className="diary-banner">
        <BookHeart size={30} />

        <div>
          <strong>Your thoughts belong here.</strong>
          <p>Write freely. There is no perfect way to journal.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowDiaryForm(!showDiaryForm)}
        >
          <Plus size={16} /> New entry
        </button>
      </div>

      {showDiaryForm && (
        <div className="panel diary-form">
          <input
            value={diaryTitle}
            onChange={(e) => setDiaryTitle(e.target.value)}
            placeholder="Give this memory a title..."
          />

          <textarea
            value={diaryText}
            onChange={(e) => setDiaryText(e.target.value)}
            placeholder="Dear diary, today I..."
            rows={6}
          />

          <div className="form-actions">
            <button
              className="secondary-button"
              onClick={() => setShowDiaryForm(false)}
            >
              Cancel
            </button>

            <button
              className="primary-button"
              onClick={saveEntry}
            >
              Save entry <Heart size={15} />
            </button>
          </div>
        </div>
      )}

      <div className="section-heading diary-heading">
        <div>
          <span className="eyebrow">YOUR COLLECTION</span>
          <h2>Little pieces of your story</h2>
        </div>

        <span className="soft-label">
          {entries.length} entries
        </span>
      </div>

      {entries.length === 0 ? (
        <div className="empty-state">
          <Flower2 size={38} />
          <h3>Your pages are waiting</h3>
          <p>Your first entry doesn't have to be perfect. Just begin.</p>
        </div>
      ) : (
        <div className="entry-grid">
          {entries.map((entry) => (
            <article className="entry-card" key={entry.id}>
              <div className="entry-date">
                <CalendarDays size={13} /> {entry.date}
              </div>

              <h3>{entry.title}</h3>
              <p>{entry.text}</p>

              <button
                className="delete-button"
                onClick={() =>
                  setEntries((old) =>
                    old.filter((e) => e.id !== entry.id)
                  )
                }
              >
                <Trash2 size={14} /> Delete
              </button>
            </article>
          ))}
        </div>
      )}

      <p className="privacy-hint">
        <LockKeyhole size={13} />
        Entries are saved in this browser on this device. They are not encrypted or synced.
      </p>
    </>
  );

  const InnerWorldPage = () => (
    <>
      <PageHeader eyebrow={pageIntro[active][0]} title={pageIntro[active][1]} description={pageIntro[active][2]} />
      <div className="inner-hero">
        <div className="inner-flower"><Flower2 size={55} /></div>
        <div><span className="eyebrow">A GENTLE SELF-DISCOVERY JOURNEY</span><h2>There is no one else quite like you.</h2><p>Your answers are precious. Save a snapshot whenever you want to remember this version of yourself. ✨</p></div>
      </div>
      <div className="reflection-grid">
        {[["happy","What makes your heart happy?","The little things that bring you joy..."],["proud","What is something you're proud of?","A moment when you felt strong or brave..."],["dream","What is a dream you hold close?","Something you'd love to experience or become..."],["value","What matters most to you?","The values you want to carry through life..."]].map(([key,title,placeholder],i)=>(
          <div className="reflection-card" key={key}><span className="reflection-number">0{i+1}</span><h3>{title}</h3><textarea rows={3} value={answers[key]} onChange={(e)=>setAnswers(old=>({...old,[key]:e.target.value}))} placeholder={placeholder}/></div>
        ))}
      </div>
      <div className="reflection-save-row"><p className="privacy-hint"><LockKeyhole size={14}/> Your answers stay in this browser.</p><button className="primary-button" onClick={saveInnerReflection} disabled={!Object.values(answers).some(value=>value.trim())}><Heart size={16}/> Save My Inner World</button></div>
      <section className="saved-notes-section"><div className="section-heading"><div><span className="eyebrow">YOUR GROWING STORY</span><h2>Saved reflections</h2></div><span className="soft-label">{savedReflections.length} memories</span></div>
        {savedReflections.length===0 ? <div className="empty-state"><Sparkles size={32}/><h3>Your reflections will bloom here</h3><p>Write a little about yourself and save your first memory.</p></div> : <div className="entry-grid">{savedReflections.map(item=><article className="entry-card" key={item.id}><div className="entry-date">{item.date}</div>{[["happy","What makes me happy"],["proud","What I'm proud of"],["dream","My dream"],["value","What matters to me"]].filter(([key])=>item.answers[key]?.trim()).map(([key,label])=><div className="reflection-saved-answer" key={key}><strong>{label}</strong><p>{item.answers[key]}</p></div>)}<button className="delete-button" onClick={()=>setSavedReflections(old=>old.filter(entry=>entry.id!==item.id))}><Trash2 size={14}/> Delete memory</button></article>)}</div>}
      </section>
    </>
  );

  const GrowPage = () => (
    <>
      <PageHeader
        eyebrow={pageIntro[active][0]}
        title={pageIntro[active][1]}
        description={pageIntro[active][2]}
      />

      <div className="growth-banner">
        <Sprout size={38} />

        <div>
          <span className="eyebrow">YOUR GENTLE PROGRESS</span>

          <h2>
            {goals.filter((g) => g.done).length} of {goals.length} little steps completed
          </h2>

          <p>Progress is progress, no matter how small.</p>
        </div>
      </div>

      <div className="progress-track">
        <div
          style={{
            width: `${
              goals.length
                ? goals.filter((g) => g.done).length / goals.length * 100
                : 0
            }%`
          }}
        />
      </div>

      <div className="section-heading">
        <div>
          <span className="eyebrow">TODAY'S LITTLE PROMISES</span>
          <h2>Your gentle goals</h2>
        </div>

        <span className="soft-label">One step at a time</span>
      </div>

      <div className="goal-list">
        {goals.map((goal) => (
          <div
            className={`goal-row ${goal.done ? "goal-done" : ""}`}
            key={goal.id}
          >
            <button
              className="goal-check"
              onClick={() => toggleGoal(goal.id)}
            >
              {goal.done
                ? <Check size={17} />
                : <Circle size={17} />
              }
            </button>

            <span>{goal.title}</span>

            <button
              className="delete-button"
              onClick={() =>
                setGoals((old) =>
                  old.filter((g) => g.id !== goal.id)
                )
              }
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      <div className="add-goal">
        <input
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addGoal();
          }}
          placeholder="Add a small goal..."
        />

        <button className="primary-button" onClick={addGoal}>
          <Plus size={16} /> Add goal
        </button>
      </div>
    </>
  );

  const storyLibrary = [
    {id:"princess",title:"Princess Adventure",emoji:"👑",tone:"story-pink",desc:"A moonlit kingdom, a hidden garden and a brave heart.",chapters:[{title:"The secret garden gate",text:"At midnight, a tiny silver key appears on your windowsill. Beyond the palace garden gate, a trail of glowing petals leads into the moonlight. What will you do?",choices:["Follow the glowing petals","Wake the royal guardian"]},{title:"The whispering fountain",text:"The fountain whispers that the kingdom's light has faded because everyone forgot to be kind. A little star is trapped beneath the water.",choices:["Offer the star a kind promise","Search for the lost royal song"]},{title:"A kingdom blooms",text:"Your kindness wakes the star. Flowers sparkle across the kingdom and the people gather to celebrate a new kind of princess: one who leads with heart.",choices:["Celebrate with the kingdom","Plant a new garden for everyone"]}]},
    {id:"crown",title:"Queen's Crown",emoji:"💎",tone:"story-purple",desc:"Solve palace mysteries and discover what makes a wise queen.",chapters:[{title:"The missing crown jewel",text:"The crown's brightest jewel has vanished before the Moon Festival. Three clues shimmer in the throne room.",choices:["Question the palace librarian","Follow glittering footprints"]},{title:"The mirror's riddle",text:"An enchanted mirror asks: what grows when it is shared, but never becomes smaller?",choices:["Answer: kindness","Answer: courage"]},{title:"The queen's promise",text:"The jewel is safe inside a box that opens only to a generous heart. You return it and promise to listen to every voice in your kingdom.",choices:["Open the festival","Create a kindness council"]}]},
    {id:"warrior",title:"Warrior Quest",emoji:"🛡️",tone:"story-blue",desc:"A magical forest quest where courage is more than fighting.",chapters:[{title:"Into the silver forest",text:"A little dragon asks for help finding its way home. The forest path splits beside a sparkling river.",choices:["Cross the stepping stones","Ask the forest sprites for help"]},{title:"The shadow bridge",text:"A storm darkens the bridge. Your dragon friend is scared, and you must choose how to continue.",choices:["Take a calm breath and go slowly","Build a safe path together"]},{title:"The bravest victory",text:"You reach the dragon village. Everyone cheers—not because you were fearless, but because you kept going with care.",choices:["Stay for the moon feast","Promise to protect the forest"]}]},
    {id:"funny",title:"The Silly Spell",emoji:"😂",tone:"story-gold",desc:"A ridiculous wizard, a talking potato and one very confused spellbook.",chapters:[{title:"Oops, the spellbook sneezed",text:"Your wizard hat turns into a dancing cabbage. The spellbook says one silly word will reverse it.",choices:["Banana tornado!","Wiggle-woggle!" ]},{title:"The potato detective",text:"A potato wearing glasses accuses the royal spoon of stealing its tiny hat. You are the detective.",choices:["Inspect the soup bowl","Interview the sleepy cat"]},{title:"The great silly finale",text:"The spoon was hiding in the wizard's boot. Everyone laughs, including the cabbage, which becomes the kingdom's new dance teacher.",choices:["Join the cabbage dance","Give the potato a medal"]}]},
    {id:"horror",title:"The Midnight Mystery",emoji:"🌙",tone:"story-purple",desc:"A gentle spooky mystery with friendly ghosts and a brave flashlight.",chapters:[{title:"A light in the attic",text:"At 12:01, a soft blue light glows upstairs. You hear a tiny 'hello' behind an old wooden door.",choices:["Knock politely","Turn on your flashlight"]},{title:"The friendly ghost",text:"A shy ghost named Pip has lost a memory book. Without it, Pip cannot remember its favourite lullaby.",choices:["Help search the dusty library","Ask the moonbeam for a clue"]},{title:"The lullaby returns",text:"You find the book beneath a star blanket. Pip sings, the attic glows, and the spooky house feels like home again.",choices:["Have a midnight cocoa","Leave a star night-light"]}]},
    {id:"life",title:"Real-Life Choices",emoji:"🌱",tone:"story-blue",desc:"Everyday choices about friendship, confidence and looking after yourself.",chapters:[{title:"A friend feels left out",text:"At lunch, you notice someone sitting alone. Your friends are already waiting for you.",choices:["Invite them to sit with you","Check in gently after lunch"]},{title:"A difficult day",text:"You made a mistake on something important. Your mind says you should give up.",choices:["Ask for help and try again","Take a break, then make a plan"]},{title:"Choosing your next step",text:"You realise growth is not about being perfect. You can be kind to yourself and still keep learning.",choices:["Write one small goal","Celebrate the effort you made"]}]}
  ];
  const chooseStory = (story) => { setActiveStory(story); setStoryChapter(0); setStoryChoices([]); };
  const GamesPage = () => (
    <>
      <PageHeader eyebrow={pageIntro[active][0]} title={pageIntro[active][1]} description={pageIntro[active][2]} />
      {activeStory ? <div className="story-panel panel">
        <button className="back-link" onClick={()=>setActiveStory(null)}>← All games</button>
        <div className="story-top"><span>{activeStory.emoji}</span><div><small>HERBLOOM STORY GAME</small><h2>{activeStory.title}</h2></div></div>
        <div className="story-progress"><span style={{width:`${((storyChapter+1)/activeStory.chapters.length)*100}%`}}/></div>
        <span className="story-chapter">CHAPTER {storyChapter+1} OF {activeStory.chapters.length}</span>
        <h3>{activeStory.chapters[storyChapter].title}</h3><p>{activeStory.chapters[storyChapter].text}</p>
        {storyChapter<activeStory.chapters.length-1 ? <div className="story-choices">{activeStory.chapters[storyChapter].choices.map((choice,i)=><button key={choice} onClick={()=>{setStoryChoices(old=>[...old,choice]);setStoryChapter(chapter=>chapter+1);}}>{choice}<Sparkles size={15}/></button>)}</div> : <div className="story-ending"><span>✨🌟🧚</span><h2>Your story has bloomed!</h2><p>You chose: {storyChoices.join(" · ")}. Every choice helped shape your adventure.</p><button className="primary-button" onClick={()=>chooseStory(activeStory)}>Play again</button><button className="secondary-button" onClick={()=>setActiveStory(null)}>Choose another game</button></div>}
      </div> : <>
        <div className="games-intro"><div><span className="eyebrow">PICK YOUR LITTLE ADVENTURE</span><h2>Which world shall we visit?</h2><p>Choose a story and shape what happens next. ✨</p></div><div className="games-intro-art">🧚✨</div></div>
        <div className="story-game-grid">{storyLibrary.map(story=><button key={story.id} className={`story-game-card ${story.tone}`} onClick={()=>chooseStory(story)}><span className="story-card-emoji">{story.emoji}</span><span className="eyebrow">MAGICAL STORY GAME</span><h3>{story.title}</h3><p>{story.desc}</p><span className="story-play">Play adventure <Sparkles size={14}/></span></button>)}</div>
        <div className="game-panel"><div className="game-heading"><div><span className="eyebrow">A LITTLE MEMORY GAME</span><h2>Find the matching pairs</h2><p>Turn over two cards and find their matching friends.</p></div><div className="score-pill"><Star size={16}/> {gameScore} pairs</div></div><div className="memory-grid">{gameItems.map((item,i)=><button key={`${i}-${item}`} className={`memory-card ${flipped.includes(i)||matched.includes(i)?"revealed":""} ${matched.includes(i)?"matched":""}`} onClick={()=>flipCard(i)}>{flipped.includes(i)||matched.includes(i)?item:"✿"}</button>)}</div>{matched.length===8&&<p className="win-message">You found every pair! Beautifully done. ♡</p>}<button className="secondary-button" onClick={restartGame}><Sparkles size={15}/> Play again</button></div>
      </>}
    </>
  );

  const SelfCarePage = () => (
    <>
      <PageHeader
        eyebrow={pageIntro[active][0]}
        title={pageIntro[active][1]}
        description={pageIntro[active][2]}
      />

      <div className="section-heading">
        <div>
          <span className="eyebrow">A LITTLE CHECK-IN</span>
          <h2>What are you feeling?</h2>
        </div>

        <span className="soft-label">
          Every feeling is welcome
        </span>
      </div>

      <div className="mood-grid">
        {moods.map(([emoji, label]) => (
          <button
            key={label}
            className={`mood-card ${mood === label ? "selected" : ""}`}
            onClick={() => setMood(label)}
          >
            <span>{emoji}</span>
            <strong>{label}</strong>
          </button>
        ))}
      </div>

      {mood && (
        <p className="mood-feedback">
          You checked in as {mood.toLowerCase()}.
          Thank yourself for pausing. ♡
        </p>
      )}

      <div className="selfcare-grid">
        <div className="selfcare-card">
          <div className="selfcare-icon">
            <Wind />
          </div>

          <span className="eyebrow">PAUSE & BREATHE</span>
          <h3>A breathing moment</h3>

          <p>
            Take a slow breath in, then gently breathe out.
          </p>

          <div className={`breathing-circle ${breathing ? "breathing" : ""}`}>
            <span>{breathing ? "Breathe..." : "♡"}</span>
          </div>

          <button
            className="secondary-button"
            onClick={() => setBreathing(!breathing)}
          >
            {breathing ? "Finish moment" : "Start breathing"}
          </button>
        </div>

        <div className="selfcare-card">
          <div className="selfcare-icon">
            <Heart />
          </div>

          <span className="eyebrow">NOTICE THE GOOD</span>
          <h3>One thing I'm grateful for</h3>

          <p>
            It can be something tiny. A warm drink, a kind word,
            a sunny morning.
          </p>

          <textarea
            rows={4}
            value={gratitude}
            onChange={(e) => setGratitude(e.target.value)}
            placeholder="Today, I'm grateful for..."
          />

          <button className="primary-button selfcare-save" onClick={saveSelfCareNote} disabled={!gratitude.trim()}>
            <Heart size={15} /> Save my note
          </button>
          <p className="privacy-hint">Saved on this device in your browser. ♡</p>
        </div>
      </div>

      <section className="saved-notes-section">
        <div className="section-heading">
          <div><span className="eyebrow">YOUR LITTLE COLLECTION</span><h2>Saved self-care notes</h2></div>
          <span className="soft-label">{selfCareNotes.length} notes</span>
        </div>
        {selfCareNotes.length === 0 ? (
          <div className="empty-state"><Heart size={30} /><h3>Your notes will bloom here</h3><p>Write a little thought and tap Save my note.</p></div>
        ) : (
          <div className="entry-grid">
            {selfCareNotes.map((note) => (
              <article className="entry-card" key={note.id}>
                <div className="entry-date">{note.date}</div>
                <p>{note.text}</p>
                <button className="delete-button" onClick={() => setSelfCareNotes((old) => old.filter((item) => item.id !== note.id))}><Trash2 size={14} /> Delete</button>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );

  const SettingsPage = () => (
    <>
      <PageHeader
        eyebrow="YOUR PREFERENCES"
        title="Your space, your way"
        description="A few settings for making HerBloom feel comfortable."
      />

      <div className="panel settings-panel profile-settings-card profile-edit-card">
        <div className="avatar profile-large">{(profileName.trim()[0] || "B").toUpperCase()}</div>
        <div className="profile-edit-content">
          <h3>Your HerBloom profile</h3>
          <p>Choose the name you would love to see in your little world.</p>
          <label className="profile-name-label" htmlFor="profile-name">Your name</label>
          <input id="profile-name" className="profile-name-input" value={profileName} maxLength={28} onChange={(event) => setProfileName(event.target.value)} placeholder="Enter your favourite name" />
          <span className="profile-saved-hint"><Check size={14} /> Saved automatically on this device</span>
        </div>
      </div>

      <div className="panel settings-panel">
        <div className="settings-icon">
          <LockKeyhole />
        </div>

        <div>
          <h3>Your privacy matters</h3>

          <p>
            This is currently a front-end demo. Chat and diary data
            are not protected by an account or secure database yet.
          </p>
        </div>
      </div>

      <div className="panel settings-panel">
        <div className="settings-icon">
          <Heart />
        </div>

        <div>
          <h3>Your personal space</h3>

          <p>
            Your reflections are yours. You can edit or clear them
            on their pages.
          </p>
        </div>
      </div>

      <button
        className="secondary-button"
        onClick={() => {
          setMood("");
          setGratitude("");
          setAnswers({ happy: "", proud: "", dream: "", value: "" });
          setSelfCareNotes([]);
        }}
      >
        Clear self-reflection and mood notes
      </button>
    </>
  );

  const currentPage =
    active === "Home" ? HomePage() :
    active === "I'm Your Buddy" ? ChatPage() :
    active === "My Secret Diary" ? DiaryPage() :
    active === "My Inner World" ? InnerWorldPage() :
    active === "Bloom & Grow" ? GrowPage() :
    active === "Happy Corner" ? GamesPage() :
    active === "Mood & Self-Care" ? SelfCarePage() :
    active === "Settings" ? SettingsPage() : HomePage();

  return (
    <div className="app-shell">
      <div className={`fairy-pointer ${fairyPointer.visible ? "is-visible" : ""}`} style={{ left: fairyPointer.x, top: fairyPointer.y }} aria-hidden="true">
        <span className="fairy-pointer-glow">✧</span>
        <span className="fairy-pointer-character">🧚🏻‍♀️</span>
        <span className="fairy-pointer-wand">🪄</span>
        <span className="fairy-pointer-sparkle sparkle-a">✦</span>
        <span className="fairy-pointer-sparkle sparkle-b">✧</span>
        <span className="fairy-pointer-sparkle sparkle-c">⋆</span>
      </div>
      <div className="storybook-magic" aria-hidden="true">
        <span className="magic-mushroom mushroom-one">🍄</span>
        <span className="magic-mushroom mushroom-two">🏡</span>
        <span className="magic-flower flower-one">🌼</span>
        <span className="magic-flower flower-two">🌷</span>
        <span className="magic-butterfly">🦋</span>
        <span className="magic-stars">✦　✧　⋆　✧　✦</span>
      </div>
      <aside className="sidebar">
        <button className="brand" onClick={() => navigate("Home")}>
          <div className="brand-icon"><Flower2 size={25} /></div>
          <div><h2>HerBloom</h2><span>YOUR LITTLE SAFE SPACE</span></div>
        </button>
        <div className="sidebar-label">YOUR SPACE</div>
        <nav>
          {menu.map(({ label, icon: Icon }) => (
            <button key={label} className={`nav-item ${active === label ? "active" : ""}`} onClick={() => navigate(label)}>
              <Icon size={19} /><span>{label}</span>
              {label === "I'm Your Buddy" && <span className="new-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="quote-card"><Flower2 size={22} /><p>"You deserve the same love you give to others."</p><span>A LITTLE REMINDER</span></div>
          <button className={`nav-item ${active === "Settings" ? "active" : ""}`} onClick={() => navigate("Settings")}><Settings size={19} /><span>Settings</span></button>
          <button className="profile-mini profile-shortcut" onClick={() => navigate("Settings")} aria-label="Open profile settings">
            <div className="avatar">{(profileName.trim()[0] || "B").toUpperCase()}</div><div><strong>{profileName || "Bloom Friend"}</strong><span>Growing every day</span></div>
          </button>
        </div>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb">Your space <span>/</span> {active}</div>
          <div className="top-actions">
            <button className="icon-button" onClick={() => navigate("My Secret Diary")} aria-label="Open diary"><Search size={19} /></button>
            <button className="icon-button notification" onClick={() => navigate("Mood & Self-Care")} aria-label="Open self care"><Bell size={19} /><i /></button>
            <button className="avatar top-avatar profile-top-button" onClick={() => navigate("Settings")} aria-label="Open profile settings">{(profileName.trim()[0] || "B").toUpperCase()}</button>
          </div>
        </header>
        <div className="page-content">{currentPage}<footer>Made with ♡ for every version of you · HerBloom</footer></div>
      </main>
    </div>
  );
}

export default App;
