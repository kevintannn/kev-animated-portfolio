"use client";

import { Content, asImageSrc, isFilled } from "@prismicio/client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MdArrowOutward } from "react-icons/md";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  items: Content.BlogPostDocument[] | Content.ProjectDocument[];
  contentType: Content.ContentIndexSlice["primary"]["content_type"];
  viewMoreText: Content.ContentIndexSlice["primary"]["view_more_text"];
  fallbackItemImage: Content.ContentIndexSlice["primary"]["fallback_item_image"];
};

const ContentList = ({
  items,
  contentType,
  viewMoreText = "Read More",
  fallbackItemImage,
}: Props) => {
  const [currentItem, setCurrentItem] = useState<null | number>(null);
  const component = useRef(null);
  const revealRef = useRef(null);
  const itemsRef = useRef<Array<HTMLLIElement | null>>([]);
  const lastMousePosition = useRef({ x: 0, y: 0 });

  const urlPrefix = contentType === "Blog" ? "/blog" : "/projects";

  const contentImages = items.map((item) => {
    const image = isFilled.image(item.data.hover_image)
      ? item.data.hover_image
      : fallbackItemImage;

    return asImageSrc(image, {
      fit: "crop",
      w: 220,
      h: 320,
      exp: -10,
    });
  });

  const onMouseEnter = (idx: number) => {
    setCurrentItem(idx);
  };

  const onMouseLeave = () => {
    setCurrentItem(null);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const mousePosition = { x: e.clientX, y: e.clientY + window.scrollY };

      // CALCULATE SPEED AND DIRECTION
      const speed = Math.sqrt(
        Math.pow(mousePosition.x - lastMousePosition.current.x, 2),
      );

      const ctx = gsap.context(() => {
        if (currentItem != null) {
          const maxY = window.scrollY + window.innerHeight - 350;
          const maxX = window.innerWidth - 250;

          gsap.to(revealRef.current, {
            x: gsap.utils.clamp(0, maxX, mousePosition.x - 110),
            y: gsap.utils.clamp(0, maxY, mousePosition.y - 160),
            rotation:
              speed * (mousePosition.x > lastMousePosition.current.x ? 1 : -1),
            ease: "back.out(2)",
            duration: 1.3,
            opacity: 1,
          });
        }

        lastMousePosition.current = mousePosition;
        return () => ctx.revert();
      }, component);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [currentItem]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      itemsRef.current.forEach((item) => {
        gsap.fromTo(
          item,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.3,
            ease: "elastic.out(1,0.3)",
            scrollTrigger: {
              trigger: item,
              start: "top bottom-=100px",
              end: "bottom center",
              toggleActions: "play none none none",
            },
          },
        );
      });
      return () => ctx.revert();
    }, component);
  }, []);

  useEffect(() => {
    contentImages.forEach((url) => {
      if (!url) return;

      const img = new Image();
      img.src = url;
    });
  }, [contentImages]);

  return (
    <div ref={component}>
      <ul
        className="grid border-b border-b-slate-100"
        onMouseLeave={onMouseLeave}
      >
        {items.map(
          (item, idx) =>
            isFilled.keyText(item.data.title) && (
              <li
                ref={(element) => (itemsRef.current[idx] = element)}
                key={idx}
                className="list-item opacity-0"
                onMouseEnter={() => onMouseEnter(idx)}
              >
                <Link
                  href={urlPrefix + "/" + item.uid}
                  className="flex flex-col justify-between border-t border-t-slate-100 py-10 text-slate-200 md:flex-row"
                  aria-label={item.data.title}
                >
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold">
                      {item.data.title}
                    </span>
                    <div className="flex gap-3 text-lg font-bold text-yellow-400">
                      {item.tags.map((tag, idx) => (
                        <span key={idx}>{tag}</span>
                      ))}
                    </div>
                  </div>

                  <span className="ml-auto flex items-center gap-2 text-xl font-medium md:ml-0">
                    {viewMoreText} <MdArrowOutward />
                  </span>
                </Link>
              </li>
            ),
        )}
      </ul>

      {/* HOVER ELEMENT */}
      <div
        ref={revealRef}
        className="hover-reveal pointer-events-none absolute left-0 top-0 -z-10 h-[320px] w-[220px] select-none rounded-lg bg-cover bg-center opacity-0 transition-[background] duration-300"
        style={{
          backgroundImage:
            currentItem != null ? `url(${contentImages[currentItem]})` : "",
        }}
      ></div>
    </div>
  );
};

export default ContentList;
