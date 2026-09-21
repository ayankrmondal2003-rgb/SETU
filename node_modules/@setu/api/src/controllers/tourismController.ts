import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/apiError.js';

const prisma = new PrismaClient();

// Helper to safely parse JSON fields stored in SQLite
function parseJsonField(val: any, fallback: any = []) {
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  }
  return val || fallback;
}

// 1. Circuits
export async function getCircuits(req: Request, res: Response, next: NextFunction) {
  try {
    const circuits = await prisma.circuit.findMany({
      include: {
        destinations: true
      }
    });

    const formatted = circuits.map(c => ({
      ...c,
      locations: parseJsonField(c.locations, []),
      gallery: parseJsonField(c.gallery, [])
    }));

    return res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    next(error);
  }
}

export async function getCircuitBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const { slug } = req.params;
    const circuit = await prisma.circuit.findUnique({
      where: { slug },
      include: {
        destinations: {
          include: { district: true }
        }
      }
    });

    if (!circuit) {
      throw new ApiError(404, 'Circuit not found');
    }

    const districtNames = Array.from(
      new Set(
        circuit.destinations
          .map(d => d.district?.name)
          .filter((name): name is string => Boolean(name))
      )
    );

    let nearbyVendors: any[] = [];
    if (districtNames.length > 0) {
      nearbyVendors = await prisma.vendor.findMany({
        where: {
          OR: districtNames.flatMap(name => [
            { district: { contains: name } },
            { city: { contains: name } }
          ])
        },
        take: 20
      });
    }

    if (nearbyVendors.length === 0) {
      nearbyVendors = await prisma.vendor.findMany({ take: 15 });
    }

    const formatted = {
      ...circuit,
      locations: parseJsonField(circuit.locations, []),
      gallery: parseJsonField(circuit.gallery, []),
      destinations: circuit.destinations.map(d => ({
        ...d,
        gallery: parseJsonField(d.gallery, []),
        travelInformation: parseJsonField(d.travelInformation, {}),
        stays: parseJsonField(d.stays, []),
        recommendations: parseJsonField(d.recommendations, [])
      })),
      nearbyVendors
    };

    return res.json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
}

// 2. Destinations
export async function getDestinations(req: Request, res: Response, next: NextFunction) {
  try {
    const { district, circuit, category, search } = req.query;

    const where: any = {};

    if (district) {
      where.district = { slug: String(district) };
    }
    if (circuit) {
      where.circuit = { slug: String(circuit) };
    }
    if (category) {
      where.category = { contains: String(category) };
    }
    if (search) {
      where.OR = [
        { name: { contains: String(search) } },
        { description: { contains: String(search) } },
        { overview: { contains: String(search) } }
      ];
    }

    const destinations = await prisma.destination.findMany({
      where,
      include: {
        district: true,
        circuit: true
      }
    });

    const formatted = destinations.map(d => ({
      ...d,
      gallery: parseJsonField(d.gallery, []),
      travelInformation: parseJsonField(d.travelInformation, {}),
      stays: parseJsonField(d.stays, []),
      recommendations: parseJsonField(d.recommendations, [])
    }));

    return res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    next(error);
  }
}

export async function getDestinationBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const { slug } = req.params;
    const destination = await prisma.destination.findUnique({
      where: { slug },
      include: {
        district: true,
        circuit: true
      }
    });

    if (!destination) {
      throw new ApiError(404, 'Destination not found');
    }

    // Query nearby vendors for interactive spot map
    let nearbyVendors = await prisma.vendor.findMany({
      where: {
        OR: [
          { district: { contains: destination.district.name } },
          { city: { contains: destination.district.name } }
        ]
      },
      take: 12
    });

    if (nearbyVendors.length === 0) {
      nearbyVendors = await prisma.vendor.findMany({
        take: 10
      });
    }

    // Query nearby attractions in same district/circuit
    const nearbyDestinations = await prisma.destination.findMany({
      where: {
        id: { not: destination.id },
        OR: [
          { districtId: destination.districtId },
          { circuitId: destination.circuitId || undefined }
        ]
      },
      take: 4,
      include: {
        district: true,
        circuit: true
      }
    });

    const formatted = {
      ...destination,
      gallery: parseJsonField(destination.gallery, []),
      travelInformation: parseJsonField(destination.travelInformation, {}),
      stays: parseJsonField(destination.stays, []),
      recommendations: parseJsonField(destination.recommendations, []),
      nearbyVendors,
      nearbyDestinations
    };

    return res.json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
}

// 3. Districts
export async function getDistricts(req: Request, res: Response, next: NextFunction) {
  try {
    const districts = await prisma.district.findMany({
      include: {
        destinations: true
      }
    });

    const formatted = districts.map(d => ({
      ...d,
      gallery: parseJsonField(d.gallery, [])
    }));

    return res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    next(error);
  }
}

export async function getDistrictBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const { slug } = req.params;
    const district = await prisma.district.findUnique({
      where: { slug },
      include: {
        destinations: true
      }
    });

    if (!district) {
      throw new ApiError(404, 'District not found');
    }

    const formatted = {
      ...district,
      gallery: parseJsonField(district.gallery, [])
    };

    return res.json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
}

// 4. Events
export async function getEvents(req: Request, res: Response, next: NextFunction) {
  try {
    const { category, search, month, year } = req.query;

    const where: any = {};
    if (category && category !== 'ALL') {
      where.category = String(category);
    }
    if (search) {
      where.OR = [
        { title: { contains: String(search) } },
        { description: { contains: String(search) } },
        { location: { contains: String(search) } }
      ];
    }

    if (month && year) {
      const m = Number(month); // 1 - 12
      const y = Number(year);
      const startOfMonth = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0));
      const endOfMonth = new Date(Date.UTC(y, m, 0, 23, 59, 59));

      where.AND = [
        { startDate: { lte: endOfMonth } },
        { endDate: { gte: startOfMonth } }
      ];
    } else if (year) {
      where.year = Number(year);
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { startDate: 'asc' }
    });

    const formatted = events.map(e => ({
      ...e,
      gallery: parseJsonField(e.gallery, [])
    }));

    return res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    next(error);
  }
}

export async function getEventBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const { slug } = req.params;
    const event = await prisma.event.findUnique({
      where: { slug }
    });

    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    // Query nearby vendors for interactive spot map
    let nearbyVendors = await prisma.vendor.findMany({
      where: {
        OR: [
          { district: { contains: event.district } },
          { city: { contains: event.district } },
          { address: { contains: event.district } }
        ]
      },
      take: 12
    });

    if (nearbyVendors.length === 0) {
      nearbyVendors = await prisma.vendor.findMany({
        take: 10
      });
    }

    // Query nearby attractions in same district or nearby region
    let nearbyAttractions = await prisma.destination.findMany({
      where: {
        OR: [
          { district: { name: { contains: event.district } } },
          { overview: { contains: event.district } }
        ]
      },
      take: 4,
      include: {
        district: true,
        circuit: true
      }
    });

    if (nearbyAttractions.length === 0) {
      nearbyAttractions = await prisma.destination.findMany({
        take: 4,
        include: {
          district: true,
          circuit: true
        }
      });
    }

    const formatted = {
      ...event,
      gallery: parseJsonField(event.gallery, []),
      nearbyRestaurants: parseJsonField(event.nearbyRestaurants, []),
      nearbyVendors,
      nearbyAttractions
    };

    return res.json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
}

// 5. Cuisine / Taste Items
export async function getCuisineItems(req: Request, res: Response, next: NextFunction) {
  try {
    const items = await prisma.cuisineItem.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const formatted = items.map(item => ({
      ...item,
      restaurants: parseJsonField(item.restaurants, [])
    }));

    return res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    next(error);
  }
}

export async function getCuisineItemBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const { slug } = req.params;
    const item = await prisma.cuisineItem.findUnique({
      where: { slug }
    });

    if (!item) {
      throw new ApiError(404, 'Cuisine item not found');
    }

    const formatted = {
      ...item,
      restaurants: parseJsonField(item.restaurants, [])
    };

    return res.json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
}
