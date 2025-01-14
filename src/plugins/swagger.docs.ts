import { fastifyBasicAuth } from "@fastify/basic-auth";
import fastifySwagger from "@fastify/swagger";
import ScalarApiReference from "@scalar/fastify-api-reference";
import { timingSafeEqual } from "crypto";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fastifyPlugin from "fastify-plugin";
import env from "../lib/env";
import { swaggerOptions } from "../utils/swagger";

export default fastifyPlugin(
    (fastify: FastifyInstance, opts: FastifyPluginOptions, done: any) => {
        fastify.register(fastifySwagger, swaggerOptions);

        // Register fastify-basic-auth plugin for basic authentication
        fastify.register(fastifyBasicAuth, {
            validate(username, password, req, reply, done) {
                if (
                    timingSafeEqual(
                        Buffer.from(username),
                        Buffer.from(env.DOC_USERNAME)
                    ) &&
                    timingSafeEqual(
                        Buffer.from(password),
                        Buffer.from(env.DOC_PASSWORD)
                    )
                ) {
                    done(); // Access granted
                } else {
                    done(new Error("Invalid credentials"));
                }
            },
            authenticate: true, // Enforce authentication on routes
        });

        fastify.register(ScalarApiReference, {
            routePrefix: "/",
            // Additional hooks for the API reference routes. You can provide the onRequest and preHandler hooks
            hooks: {
                onRequest: function (request, reply, done) {
                    fastify.basicAuth(request, reply, done);
                    done();
                },
                preHandler: function (request, reply, done) {
                    done();
                },
            },
            configuration: {
                // layout: 'default',
                metaData: {
                    title: "Passman Docs",
                    description: "API documentation of Passman",
                    ogDescription: "API documentation of Passman",
                    ogTitle: "Passman Docs",
                    ogImage: "https://example.com/image.png",
                    twitterCard: "summary_large_image",
                    // Add more...
                },
                theme: "saturn", // alternate, default, moon, purple, solarized, bluePlanet, saturn, kepler, mars, deepSpace, none
                hideDownloadButton: true,
                favicon:
                    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM1N2UzODkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1maWxlLWNvZGUiPjxwYXRoIGQ9Ik0xMCAxMi41IDggMTVsMiAyLjUiLz48cGF0aCBkPSJtMTQgMTIuNSAyIDIuNS0yIDIuNSIvPjxwYXRoIGQ9Ik0xNCAydjRhMiAyIDAgMCAwIDIgMmg0Ii8+PHBhdGggZD0iTTE1IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY3eiIvPjwvc3ZnPg==",
            },
        });
        done();
    }
);
