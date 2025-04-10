'use client';
import Image from 'next/image';
import {useState, useCallback} from 'react';

import {generateAltText} from '@/ai/flows/generate-alt-text';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Icons} from '@/components/icons';

const DUMMY_IMAGES = [
  {id: '1', src: 'https://picsum.photos/id/10/800/600', alt: 'A scenic landscape'},
  {id: '2', src: 'https://picsum.photos/id/20/800/600', alt: 'An abstract painting'},
  {id: '3', src: 'https://picsum.photos/id/30/800/600', alt: 'A portrait of a person'},
  {id: '4', src: 'https://picsum.photos/id/40/800/600', alt: 'A cityscape at night'},
  {id: '5', src: 'https://picsum.photos/id/50/800/600', alt: 'A close-up of a flower'},
  {id: '6', src: 'https://picsum.photos/id/60/800/600', alt: 'A group of animals in the wild'},
];

export default function Home() {
  const [images, setImages] = useState(DUMMY_IMAGES);
  const [sortOrder, setSortOrder] = useState('default');
  const [filterTerm, setFilterTerm] = useState('');
  const [openCarousel, setOpenCarousel] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleSortChange = (value: string) => {
    setSortOrder(value);
    if (value === 'name') {
      setImages([...images].sort((a, b) => a.alt.localeCompare(b.alt)));
    } else if (value === 'date') {
      alert('Sort by date not implemented yet');
    } else {
      setImages(DUMMY_IMAGES);
    }
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterTerm(event.target.value);
    if (event.target.value) {
      setImages(DUMMY_IMAGES.filter(img => img.alt.toLowerCase().includes(event.target.value.toLowerCase())));
    } else {
      setImages(DUMMY_IMAGES);
    }
  };

  const handleMissingAltText = async (id: string, imageUrl: string) => {
    const altTextResult = await generateAltText({imageUrl: imageUrl});
    const updatedImages = images.map(img => {
      if (img.id === id) {
        return {...img, alt: altTextResult.altText};
      }
      return img;
    });
    setImages(updatedImages);
  };

  const openImageCarousel = (index: number) => {
    setSelectedImageIndex(index);
    setOpenCarousel(true);
  };

  const closeImageCarousel = () => {
    setOpenCarousel(false);
  };

  const goToPreviousImage = useCallback(() => {
    setSelectedImageIndex(prevIndex => (prevIndex - 1 + images.length) % images.length);
  }, [images.length]);

  const goToNextImage = useCallback(() => {
    setSelectedImageIndex(prevIndex => (prevIndex + 1) % images.length);
  }, [images.length]);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Aesthetica Gallery</CardTitle>
          <CardDescription>A beautiful gallery app</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <Select onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="date">Upload Date</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="text"
              placeholder="Filter by name..."
              value={filterTerm}
              onChange={handleFilterChange}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={image.id}>
                <button onClick={() => openImageCarousel(index)} className="w-full block rounded-md shadow-md overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt || 'No alt text'}
                    width={400}
                    height={300}
                    className="object-cover aspect-video"
                  />
                </button>
                {!image.alt && (
                  <div className="mt-2 flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Missing alt text</p>
                    <Button
                      size="sm"
                      onClick={() => handleMissingAltText(image.id, image.src)}
                    >
                      Generate Alt Text
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Image Carousel Overlay */}
      {openCarousel && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 z-50 flex items-center justify-center">
          <button
            onClick={closeImageCarousel}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-50 p-2 rounded-full"
          >
            <Icons.close className="h-6 w-6" />
          </button>

          <button
            onClick={goToPreviousImage}
            className="absolute left-4 text-white hover:text-gray-300 z-50 p-2 rounded-full"
          >
            <Icons.arrowRight className="h-6 w-6 rotate-180" />
          </button>

          <Image
            src={images[selectedImageIndex].src}
            alt={images[selectedImageIndex].alt || 'No alt text'}
            width={1024}
            height={768}
            className="max-w-5xl max-h-5xl object-contain"
            style={{maxWidth: '90vw', maxHeight: '90vh'}}
          />

          <button
            onClick={goToNextImage}
            className="absolute right-4 text-white hover:text-gray-300 z-50 p-2 rounded-full"
          >
            <Icons.arrowRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
}
