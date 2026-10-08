import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Camera } from "lucide-react";
import { motion } from "framer-motion";
import type { Trip } from "@/lib/types";
export function MemoryCard({ trip }: { trip: Trip }) {
  return (
    <motion.div whileHover={{ y: -5 }} className="memory-card">
      <Link to="/memories/$tripId" params={{ tripId: trip.id }} className="block">
        <div className="memory-cover">
          <img src={trip.cover} alt={`${trip.destination} travel memories`} loading="lazy" />
          <span className="photo-count">
            <Camera size={13} />
            {trip.photoCount} photos
          </span>
          <span className="memory-arrow">
            <ArrowUpRight size={20} />
          </span>
          <div className="cover-location">
            <span />
            {trip.destination.toUpperCase()}, INDIA
          </div>
        </div>
        <div className="memory-info">
          <div>
            <h3>{trip.destination}</h3>
            <p>{trip.subtitle}</p>
          </div>
          <span className="trip-date">{trip.date}</span>
        </div>
      </Link>
    </motion.div>
  );
}
