import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "wouter";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const [location] = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentChildren, setCurrentChildren] = useState(children);

  useEffect(() => {
    if (currentChildren !== children) {
      setIsTransitioning(true);
      
      // Start exit animation
      setTimeout(() => {
        setCurrentChildren(children);
        setIsTransitioning(false);
      }, 150); // Half the transition duration
    }
  }, [children, currentChildren]);

  return (
    <div 
      className={`page-transition ${isTransitioning ? 'transitioning' : ''}`}
      key={location}
    >
      {currentChildren}
    </div>
  );
}