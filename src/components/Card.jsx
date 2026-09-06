import "../styles/components/card.scss";

function Card({ titleName="", title=true, children, className = "", styleCard = {} }) {
    return (
        <section className={`card ${className}`.trim()} style={styleCard}>
            {title && (
                <header className="card-tab">
                    <h2>{titleName}</h2>
                </header>
            )}
            <div className="card-body">{children}</div>
        </section>
    );
}

export default Card;
