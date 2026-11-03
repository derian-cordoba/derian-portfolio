// Optional macOS authoring helper. The generated PDF is a portable static asset.
// clang -framework AppKit -framework PDFKit scripts/generate-resume-es.m -o /tmp/portfolio-resume
// /tmp/portfolio-resume src/content/resume-es.json public/Derian-Cordoba-CV-2026-ES.pdf
#import <AppKit/AppKit.h>
#import <PDFKit/PDFKit.h>

static NSAttributedString *styled(NSString *text, CGFloat size, BOOL bold, NSColor *color) {
    NSMutableParagraphStyle *paragraph = [[NSMutableParagraphStyle alloc] init];
    paragraph.lineSpacing = 1.5;
    return [[NSAttributedString alloc] initWithString:text attributes:@{
        NSFontAttributeName: bold ? [NSFont boldSystemFontOfSize:size] : [NSFont systemFontOfSize:size],
        NSForegroundColorAttributeName: color,
        NSParagraphStyleAttributeName: paragraph
    }];
}

static void footer(NSUInteger page) {
    NSAttributedString *text = styled([NSString stringWithFormat:@"Derian Córdoba | Currículum en español | %lu", (unsigned long)page], 8, NO, [NSColor grayColor]);
    [text drawAtPoint:NSMakePoint(40, 24)];
}

int main(int argc, const char *argv[]) {
    @autoreleasepool {
        if (argc != 3) { return 1; }
        NSData *input = [NSData dataWithContentsOfFile:@(argv[1])];
        NSArray *rows = [NSJSONSerialization JSONObjectWithData:input options:0 error:nil];
        if (!rows) { return 2; }
        CGRect media = CGRectMake(0, 0, 595, 842);
        NSURL *output = [NSURL fileURLWithPath:@(argv[2])];
        CGContextRef context = CGPDFContextCreateWithURL((__bridge CFURLRef)output, &media,
            (__bridge CFDictionaryRef)@{(__bridge NSString *)kCGPDFContextTitle: @"Derian Córdoba - Currículum en español", (__bridge NSString *)kCGPDFContextAuthor: @"Derian Córdoba"});
        if (!context) { return 3; }
        [NSGraphicsContext saveGraphicsState];
        [NSGraphicsContext setCurrentContext:[NSGraphicsContext graphicsContextWithCGContext:context flipped:NO]];
        NSColor *blue = [NSColor colorWithSRGBRed:0.14 green:0.30 blue:0.59 alpha:1];
        CGFloat y = 38;
        NSUInteger page = 1;
        CGPDFContextBeginPage(context, NULL);
        for (NSDictionary *row in rows) {
            NSString *type = row[@"type"];
            BOOL heading = [type isEqual:@"heading"];
            BOOL job = [type isEqual:@"job"];
            BOOL title = [type isEqual:@"title"];
            BOOL contact = [type isEqual:@"contact"];
            BOOL subtitle = [type isEqual:@"subtitle"];
            BOOL bullet = [type isEqual:@"bullet"];
            CGFloat size = title ? 23 : heading ? 11 : job ? 10 : contact ? 8.5 : 9.5;
            NSString *text = bullet ? [@"- " stringByAppendingString:row[@"text"]] : row[@"text"];
            NSAttributedString *line = styled(text, size, heading || job || title || subtitle, heading || title ? blue : [NSColor colorWithWhite:0.15 alpha:1]);
            CGFloat gap = heading ? 15 : job ? 11 : 4;
            CGFloat height = ceil([line boundingRectWithSize:NSMakeSize(515, 10000) options:NSStringDrawingUsesLineFragmentOrigin | NSStringDrawingUsesFontLeading].size.height) + 2;
            CGFloat reserve = heading || job ? 45 : 0;
            if (y + gap + height + reserve > 790) {
                footer(page);
                CGPDFContextEndPage(context);
                CGPDFContextBeginPage(context, NULL);
                page += 1;
                y = 38;
            }
            y += gap;
            [line drawWithRect:NSMakeRect(40, 842 - y - height, 515, height) options:NSStringDrawingUsesLineFragmentOrigin | NSStringDrawingUsesFontLeading];
            y += height;
        }
        footer(page);
        CGPDFContextEndPage(context);
        CGPDFContextClose(context);
        CGContextRelease(context);
        [NSGraphicsContext restoreGraphicsState];
        PDFDocument *document = [[PDFDocument alloc] initWithURL:output];
        for (NSUInteger i = 0; i < document.pageCount; i++) {
            PDFPage *pdfPage = [document pageAtIndex:i];
            NSImage *image = [pdfPage thumbnailOfSize:NSMakeSize(1000, 1415) forBox:kPDFDisplayBoxMediaBox];
            NSBitmapImageRep *bitmap = [NSBitmapImageRep imageRepWithData:image.TIFFRepresentation];
            [[bitmap representationUsingType:NSBitmapImageFileTypePNG properties:@{}] writeToFile:[NSString stringWithFormat:@"/private/tmp/portfolio-resume-es-%lu.png", (unsigned long)i + 1] atomically:YES];
        }
        printf("Created Spanish CV: %lu pages\n", (unsigned long)document.pageCount);
    }
    return 0;
}
