import { useState } from 'react'
import '../style/interview.scss'


const DUMMY_REPORT = {
    matchScore: 88,
    technicalQuestions: [
        {
            question: "Explain the Node.js Event Loop and how it handles asynchronous operations.",
            intention: "To assess your understanding of Node.js core internals and whether you can explain non-blocking I/O clearly.",
            answer: "The Event Loop is what allows Node.js to perform non-blocking I/O operations despite JavaScript being single-threaded. It works by offloading operations to the system kernel whenever possible. The loop has several phases: timers, pending callbacks, idle/prepare, poll, check, and close callbacks. Each phase has a FIFO queue of callbacks to execute. process.nextTick() fires before the next iteration of the event loop, while setImmediate() fires in the check phase."
        },
        {
            question: "What is the difference between process.nextTick() and setImmediate()?",
            intention: "Tests deeper knowledge of the event loop phases and execution order — a common source of bugs.",
            answer: "process.nextTick() callbacks are executed before the event loop continues to the next phase, essentially queuing them at the end of the current operation. setImmediate() schedules callbacks to execute in the check phase of the next event loop iteration. In practice, nextTick fires before I/O events and setImmediate fires after them."
        },
        {
            question: "How do Node.js Streams work and when would you use them?",
            intention: "Evaluates whether you understand memory-efficient data handling, important for backend roles dealing with large files or real-time data.",
            answer: "Streams are objects that let you read or write data continuously. There are four types: Readable, Writable, Duplex, and Transform. They use EventEmitter and process data in chunks instead of loading everything into memory. You'd use streams when handling large file uploads, video streaming, or piping data between sources — essentially any time the full dataset shouldn't be held in RAM."
        },
        {
            question: "Describe Compound Indexes in MongoDB and their impact on query performance.",
            intention: "Checks your ability to optimize database queries — a skill expected of senior backend engineers.",
            answer: "A compound index is an index on multiple fields. MongoDB uses the index prefix rule, meaning a compound index on {a, b, c} supports queries on {a}, {a, b}, or {a, b, c} but not on {b} alone. The order of fields matters: put equality fields first, range fields last, and high-cardinality fields before low-cardinality ones. Using .explain('executionStats') helps validate if your query is using the index as expected."
        },
        {
            question: "How would you implement rate limiting in an Express.js application?",
            intention: "Practical systems design question that assesses whether you consider security and scalability.",
            answer: "For simple cases, use the express-rate-limit middleware which stores request counts in memory. For distributed systems, use a Redis-backed store (via rate-limit-redis) so limits are shared across multiple server instances. You'd configure a window (e.g. 15 minutes), max requests per window, and a custom error response. For finer control, implement a sliding window algorithm using Redis sorted sets."
        },
    ],
    behavioralQuestions: [
        {
            question: "Tell me about a time you had to debug a critical production issue under pressure.",
            intention: "Assesses composure under stress, debugging methodology, and communication during an incident.",
            answer: "Use the STAR format. Describe a real incident — e.g., a memory leak causing server crashes. Walk through how you identified it (monitoring alerts, logs), how you triaged (isolated the service, rolled back), and how you fixed it (found a circular reference in a socket handler). Emphasize what you communicated to stakeholders and what post-mortem actions prevented recurrence."
        },
        {
            question: "Describe a situation where you disagreed with a technical decision made by your team.",
            intention: "Tests whether you can advocate for your viewpoint constructively while remaining a team player.",
            answer: "Pick a real example where you raised a concern professionally — e.g., pushing back on a REST-only architecture when WebSockets were needed. Explain how you presented a proof-of-concept to make your case, how the team responded, and whether you ultimately aligned with the team decision. Show you can disagree and commit."
        },
        {
            question: "How do you handle working with a codebase you're unfamiliar with?",
            intention: "Evaluates your onboarding efficiency and self-sufficiency as an engineer.",
            answer: "Start by reading the README and architecture docs, then trace a single feature end-to-end from the API route to the database. Use debugging tools to understand data flow rather than guessing. Ask targeted questions with context ('I see X is used here, is that because of Y?') rather than open-ended ones. Write down your mental model and verify it."
        },
    ],
    preparationPlan: [
        {
            day: 1,
            focus: "Node.js Internals & Streams",
            tasks: [
                "Deep dive into the Event Loop phases and process.nextTick vs setImmediate.",
                "Practice implementing Node.js Streams for handling large data sets.",
            ]
        },
        {
            day: 2,
            focus: "Advanced MongoDB & Indexing",
            tasks: [
                "Study Compound Indexes, TTL Indexes, and Text Indexes.",
                "Practice writing Complex Aggregation pipelines and using the .explain('executionStats') method.",
            ]
        },
        {
            day: 3,
            focus: "Caching & Redis Strategies",
            tasks: [
                "Read about Redis data types beyond strings (Sets, Hashes, Sorted Sets).",
                "Implement a Redis-based rate limiter or a caching layer for a sample API.",
            ]
        },
        {
            day: 4,
            focus: "System Design & Microservices",
            tasks: [
                "Study Microservices communication patterns (Synchronous vs Asynchronous).",
                "Learn about the API Gateway pattern and Circuit Breakers.",
            ]
        },
        {
            day: 5,
            focus: "Message Queues & DevOps Basics",
            tasks: [
                "Watch introductory tutorials on RabbitMQ or Kafka.",
                "Dockerize a project and write a simple GitHub Actions workflow for CI.",
            ]
        },
        {
            day: 6,
            focus: "Data Structures & Algorithms",
            tasks: [
                "Solve 5–10 Medium LeetCode problems focusing on Arrays, Strings, and Hash Maps.",
                "Review common sorting and searching algorithms.",
            ]
        },
        {
            day: 7,
            focus: "Mock Interview & Project Review",
            tasks: [
                "Conduct a mock interview focusing on explaining the Real-time Chat Application architecture.",
                "Prepare concise summaries for all work experience bullets.",
            ]
        },
    ],
    skillGaps: [
        { skill: "Message Queues (Kafka/RabbitMQ)", severity: "high" },
        { skill: "Advanced Docker & CI/CD Pipelines", severity: "medium" },
        { skill: "Distributed Systems Design", severity: "medium" },
        { skill: "Production-level Redis management", severity: "low" },
    ]
}

const NAV_ITEMS = [
    {
        id: 'technical', label: 'Technical Questions',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
            </svg>
        )
    },
    {
        id: 'behavioral', label: 'Behavioral Questions',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        )
    },
    {
        id: 'roadmap', label: 'Road Map',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
        )
    },
]


const QuestionCard = ({ item, index }: { item: typeof DUMMY_REPORT.technicalQuestions[0], index: number }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className='q-card'>
            <div className='q-card__header' onClick={() => setOpen(o => !o)}>
                <span className='q-card__index'>Q{index + 1}</span>
                <p className='q-card__question'>{item.question}</p>
                <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </span>
            </div>
            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--intention'>Intention</span>
                        <p>{item.intention}</p>
                    </div>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--answer'>Model Answer</span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }: { day: typeof DUMMY_REPORT.preparationPlan[0] }) => (
    <div className='roadmap-day'>
        <div className='roadmap-day__header'>
            <span className='roadmap-day__badge'>Day {day.day}</span>
            <h3 className='roadmap-day__focus'>{day.focus}</h3>
        </div>
        <ul className='roadmap-day__tasks'>
            {day.tasks.map((task, i) => (
                <li key={i}>
                    <span className='roadmap-day__bullet' />
                    {task}
                </li>
            ))}
        </ul>
    </div>
)


const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const report = DUMMY_REPORT

    const scoreColor =
        report.matchScore >= 75 ? 'score--high' :
        report.matchScore >= 50 ? 'score--mid' : 'score--low'

    return (
        <div className='interview-page'>
            <div className='interview-layout'>

                {/* ── Left Nav ── */}
                <nav className='interview-nav'>
                    <div className="nav-content">
                        <p className='interview-nav__label'>Sections</p>
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <span className='interview-nav__icon'>{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                    <button className='button primary-button'>
                        <svg height="0.8rem" style={{ marginRight: "0.8rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z" />
                        </svg>
                        Download Resume
                    </button>
                </nav>

                <div className='interview-divider' />

                {/* ── Center Content ── */}
                <main className='interview-content'>
                    {activeNav === 'technical' && (
                        <section>
                            <div className='content-header'>
                                <h2>Technical Questions</h2>
                                <span className='content-header__count'>{report.technicalQuestions.length} questions</span>
                            </div>
                            <div className='q-list'>
                                {report.technicalQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'behavioral' && (
                        <section>
                            <div className='content-header'>
                                <h2>Behavioral Questions</h2>
                                <span className='content-header__count'>{report.behavioralQuestions.length} questions</span>
                            </div>
                            <div className='q-list'>
                                {report.behavioralQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'roadmap' && (
                        <section>
                            <div className='content-header'>
                                <h2>Preparation Road Map</h2>
                                <span className='content-header__count'>{report.preparationPlan.length}-day plan</span>
                            </div>
                            <div className='roadmap-list'>
                                {report.preparationPlan.map((day) => (
                                    <RoadMapDay key={day.day} day={day} />
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                <div className='interview-divider' />

                {/* ── Right Sidebar ── */}
                <aside className='interview-sidebar'>

                    {/* Match Score */}
                    <div className='match-score'>
                        <p className='match-score__label'>Match Score</p>
                        <div className={`match-score__ring ${scoreColor}`}>
                            <span className='match-score__value'>{report.matchScore}</span>
                            <span className='match-score__pct'>%</span>
                        </div>
                        <p className='match-score__sub'>Strong match for this role</p>
                    </div>

                    <div className='sidebar-divider' />

                    {/* Skill Gaps */}
                    <div className='skill-gaps'>
                        <p className='skill-gaps__label'>Skill Gaps</p>
                        <div className='skill-gaps__list'>
                            {report.skillGaps.map((gap, i) => (
                                <span key={i} className={`skill-tag skill-tag--${gap.severity}`}>
                                    {gap.skill}
                                </span>
                            ))}
                        </div>
                    </div>

                </aside>
            </div>
        </div>
    )
}

export default Interview