import React from "react";
import Link from "next/link";
import {
  Sword,
  TentTree,
  Pencil,
  Laugh,
  Slice,
  BedDouble,
  Rocket,
  Ghost,
} from "lucide-react";

const GenresCard = () => {
  const styles = {
    card1:
      "w-full rounded-xl border bg-card p-4 group hover:bg-primary transition-all",
    card2: "flex items-center gap-4",
    card3: `aspect-square w-16 bg-secondary flex items-center justify-center rounded-lg group-hover:bg-white transition-all overflow-clip`,
    h1: "font-extrabold text-lg group-hover:text-white transition-all",
    p: "text-sm group-hover:text-white transition-all text-muted-foreground",
    icon: "group-hover:text-primary group-hover:scale-125 transition-all",
    iconSize: 36,
  };

  return (
    <section className="container">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <article>
          <Link href="/genres/28/1">
            <div className={styles.card1}>
              <div className={styles.card2}>
                <figure className={styles.card3}>
                  <Sword
                    size={styles.iconSize}
                    className={`${styles.icon} group-hover:rotate-90`}
                  />
                </figure>
                <div>
                  <h1 className={styles.h1}>Action</h1>
                  <p className={styles.p}>View</p>
                </div>
              </div>
            </div>
          </Link>
        </article>
        <article>
          <Link href="https://chatgpt.com/">
            <div className={styles.card1}>
              <div className={styles.card2}>
                <figure className={styles.card3}>
                  <TentTree
                    size={styles.iconSize}
                    className={`${styles.icon}`}
                  />
                </figure>
                <div>
                  <h1 className={styles.h1}>Adventure</h1>
                  <p className={styles.p}>View</p>
                </div>
              </div>
            </div>
          </Link>
        </article>
        <article>
          <Link href="/genres/16/1">
            <div className={styles.card1}>
              <div className={styles.card2}>
                <figure className={styles.card3}>
                  <Pencil
                    size={styles.iconSize}
                    className={`${styles.icon} group-hover:rotate-45`}
                  />
                </figure>
                <div>
                  <h1 className={styles.h1}>Animation</h1>
                  <p className={styles.p}>View</p>
                </div>
              </div>
            </div>
          </Link>
        </article>
        <article>
          <Link href="/genres/35/1">
            <div className={styles.card1}>
              <div className={styles.card2}>
                <figure className={styles.card3}>
                  <Laugh
                    size={styles.iconSize}
                    className={`group-hover:text-primary transition-all group-hover:animate-spin`}
                  />
                </figure>
                <div>
                  <h1 className={styles.h1}>Comedy</h1>
                  <p className={styles.p}>View</p>
                </div>
              </div>
            </div>
          </Link>
        </article>
        <article>
          <Link href="/genres/27/1">
            <div className={styles.card1}>
              <div className={styles.card2}>
                <figure className={styles.card3}>
                  <Ghost size={styles.iconSize} className={`${styles.icon}`} />
                </figure>
                <div>
                  <h1 className={styles.h1}>Horror</h1>
                  <p className={styles.p}>View</p>
                </div>
              </div>
            </div>
          </Link>
        </article>
        <article>
          <Link href="/genres/878/1">
            <div className={styles.card1}>
              <div className={styles.card2}>
                <figure className={styles.card3}>
                  <Rocket size={styles.iconSize} className={`${styles.icon}`} />
                </figure>
                <div>
                  <h1 className={styles.h1}>Sci Fi</h1>
                  <p className={styles.p}>View</p>
                </div>
              </div>
            </div>
          </Link>
        </article>
        <article>
          <Link href="/genres/10749/1">
            <div className={styles.card1}>
              <div className={styles.card2}>
                <figure className={styles.card3}>
                  <BedDouble
                    size={styles.iconSize}
                    className={`group-hover:text-primary transition-all group-hover:animate-bounce`}
                  />
                </figure>
                <div>
                  <h1 className={styles.h1}>Romance</h1>
                  <p className={styles.p}>View</p>
                </div>
              </div>
            </div>
          </Link>
        </article>
        <article>
          <Link href="/genres/53/1">
            <div className={styles.card1}>
              <div className={styles.card2}>
                <figure className={styles.card3}>
                  <Slice
                    size={styles.iconSize}
                    className={`${styles.icon} -rotate-45 group-hover:translate-y-5`}
                  />
                </figure>
                <div>
                  <h1 className={styles.h1}>Thriller</h1>
                  <p className={styles.p}>View</p>
                </div>
              </div>
            </div>
          </Link>
        </article>
      </div>
    </section>
  );
};

export default GenresCard;
